import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { PhotoReview } from "@/types/database";

export interface PhotoReviewsState {
    photoReviews: PhotoReview[];
    approvedPhotoReviews: PhotoReview[];
    isLoading: boolean;
    isLoadingApproved: boolean;
    error: string | null;
    lastFetchAll: number | null;
    lastFetchApproved: number | null;
    cacheTimeout: number;

    // Actions
    fetchPhotoReviews: (force?: boolean) => Promise<void>;
    fetchApprovedPhotoReviews: (force?: boolean) => Promise<void>;
    addPhotoReview: (
        review: Omit<PhotoReview, "_id" | "createdAt" | "updatedAt">
    ) => Promise<PhotoReview | null>;
    updatePhotoReview: (
        id: string,
        updates: Partial<PhotoReview>
    ) => Promise<void>;
    deletePhotoReview: (id: string) => Promise<void>;
    clearCache: () => void;
    clearError: () => void;
}

export const usePhotoReviewsStore = create<PhotoReviewsState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                photoReviews: [],
                approvedPhotoReviews: [],
                isLoading: false,
                isLoadingApproved: false,
                error: null,
                lastFetchAll: null,
                lastFetchApproved: null,
                cacheTimeout: 5 * 60 * 1000, // 5 minutes

                // Fetch all photo reviews
                fetchPhotoReviews: async (force = false) => {
                    const state = get();
                    const now = Date.now();

                    // Check if we need to fetch (cache is expired or force is true)
                    if (
                        !force &&
                        state.lastFetchAll &&
                        now - state.lastFetchAll < state.cacheTimeout
                    ) {
                        return;
                    }

                    set({ isLoading: true, error: null });

                    try {
                        const response = await fetch("/api/photo-reviews");
                        if (!response.ok) {
                            throw new Error("Failed to fetch photo reviews");
                        }

                        const data = await response.json();
                        set({
                            photoReviews: data,
                            lastFetchAll: now,
                            isLoading: false,
                        });
                    } catch (error) {
                        set({
                            error:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error",
                            isLoading: false,
                        });
                    }
                },

                // Fetch only approved photo reviews
                fetchApprovedPhotoReviews: async (force = false) => {
                    const state = get();
                    const now = Date.now();

                    // Check if we need to fetch (cache is expired or force is true)
                    if (
                        !force &&
                        state.lastFetchApproved &&
                        now - state.lastFetchApproved < state.cacheTimeout
                    ) {
                        return;
                    }

                    set({ isLoadingApproved: true, error: null });

                    try {
                        const response = await fetch(
                            "/api/photo-reviews?approved=true"
                        );
                        if (!response.ok) {
                            throw new Error(
                                "Failed to fetch approved photo reviews"
                            );
                        }

                        const data = await response.json();
                        set({
                            approvedPhotoReviews: data,
                            lastFetchApproved: now,
                            isLoadingApproved: false,
                        });
                    } catch (error) {
                        set({
                            error:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error",
                            isLoadingApproved: false,
                        });
                    }
                },

                // Add new photo review
                addPhotoReview: async (reviewData) => {
                    set({ error: null });

                    try {
                        const response = await fetch("/api/photo-reviews", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(reviewData),
                        });

                        if (!response.ok) {
                            throw new Error("Failed to add photo review");
                        }

                        const result = await response.json();

                        // Refetch data to update the store
                        await get().fetchPhotoReviews(true);
                        if (reviewData.isApproved) {
                            await get().fetchApprovedPhotoReviews(true);
                        }

                        return result;
                    } catch (error) {
                        set({
                            error:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error",
                        });
                        return null;
                    }
                },

                // Update photo review
                updatePhotoReview: async (id, updates) => {
                    set({ error: null });

                    try {
                        const response = await fetch(
                            `/api/photo-reviews/${id}`,
                            {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(updates),
                            }
                        );

                        if (!response.ok) {
                            throw new Error("Failed to update photo review");
                        }

                        // Update local state
                        set((state) => ({
                            photoReviews: state.photoReviews.map((review) =>
                                review._id?.toString() === id
                                    ? { ...review, ...updates }
                                    : review
                            ),
                            approvedPhotoReviews:
                                state.approvedPhotoReviews.map((review) =>
                                    review._id?.toString() === id
                                        ? { ...review, ...updates }
                                        : review
                                ),
                        }));
                    } catch (error) {
                        set({
                            error:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error",
                        });
                    }
                },

                // Delete photo review
                deletePhotoReview: async (id) => {
                    set({ error: null });

                    try {
                        const response = await fetch(
                            `/api/photo-reviews/${id}`,
                            {
                                method: "DELETE",
                            }
                        );

                        if (!response.ok) {
                            throw new Error("Failed to delete photo review");
                        }

                        // Remove from local state
                        set((state) => ({
                            photoReviews: state.photoReviews.filter(
                                (review) => review._id?.toString() !== id
                            ),
                            approvedPhotoReviews:
                                state.approvedPhotoReviews.filter(
                                    (review) => review._id?.toString() !== id
                                ),
                        }));
                    } catch (error) {
                        set({
                            error:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error",
                        });
                    }
                },

                // Clear cache - forces next fetch
                clearCache: () => {
                    set({
                        lastFetchAll: null,
                        lastFetchApproved: null,
                        photoReviews: [],
                        approvedPhotoReviews: [],
                    });
                },

                // Clear error
                clearError: () => {
                    set({ error: null });
                },
            }),
            {
                name: "photo-reviews-store",
                partialize: (state) => ({
                    photoReviews: state.photoReviews,
                    approvedPhotoReviews: state.approvedPhotoReviews,
                    lastFetchAll: state.lastFetchAll,
                    lastFetchApproved: state.lastFetchApproved,
                }),
            }
        ),
        {
            name: "photo-reviews-store",
        }
    )
);
