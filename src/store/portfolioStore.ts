import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { PortfolioItem } from "@/types/database";

export interface PortfolioState {
    portfolioItems: PortfolioItem[];
    isLoading: boolean;
    error: string | null;
    lastFetch: number | null;
    cacheTimeout: number;
    fetchPortfolioItems: (force?: boolean) => Promise<void>;
    addPortfolioItem: (
        item: Omit<PortfolioItem, "_id" | "createdAt" | "updatedAt">
    ) => Promise<PortfolioItem | null>;
    updatePortfolioItem: (
        id: string,
        updates: Partial<PortfolioItem>
    ) => Promise<void>;
    deletePortfolioItem: (id: string) => Promise<void>;
    clearCache: () => void;
    clearError: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
    devtools(
        persist(
            (set, get) => ({
                portfolioItems: [],
                isLoading: false,
                error: null,
                lastFetch: null,
                cacheTimeout: 10 * 60 * 1000,

                fetchPortfolioItems: async (force = false) => {
                    const state = get();
                    const now = Date.now();

                    if (
                        !force &&
                        state.lastFetch &&
                        now - state.lastFetch < state.cacheTimeout
                    ) {
                        return;
                    }

                    set({ isLoading: true, error: null });

                    try {
                        const response = await fetch("/api/portfolio");
                        if (!response.ok) {
                            throw new Error("Failed to fetch portfolio items");
                        }

                        const data = await response.json();
                        set({
                            portfolioItems: data,
                            lastFetch: now,
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

                addPortfolioItem: async (itemData) => {
                    set({ error: null });

                    try {
                        const response = await fetch("/api/portfolio", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(itemData),
                        });

                        if (!response.ok) {
                            throw new Error("Failed to add portfolio item");
                        }

                        const result = await response.json();

                        await get().fetchPortfolioItems(true);

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

                updatePortfolioItem: async (id, updates) => {
                    set({ error: null });

                    try {
                        const response = await fetch(`/api/portfolio/${id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(updates),
                        });

                        if (!response.ok) {
                            throw new Error("Failed to update portfolio item");
                        }

                        set((state) => ({
                            portfolioItems: state.portfolioItems.map((item) =>
                                item._id?.toString() === id
                                    ? { ...item, ...updates }
                                    : item
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

                deletePortfolioItem: async (id) => {
                    set({ error: null });

                    try {
                        const response = await fetch(`/api/portfolio/${id}`, {
                            method: "DELETE",
                        });

                        if (!response.ok) {
                            throw new Error("Failed to delete portfolio item");
                        }

                        set((state) => ({
                            portfolioItems: state.portfolioItems.filter(
                                (item) => item._id?.toString() !== id
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

                clearCache: () => {
                    set({
                        lastFetch: null,
                        portfolioItems: [],
                    });
                },

                clearError: () => {
                    set({ error: null });
                },
            }),
            {
                name: "portfolio-store",
                partialize: (state) => ({
                    portfolioItems: state.portfolioItems,
                    lastFetch: state.lastFetch,
                }),
            }
        ),
        {
            name: "portfolio-store",
        }
    )
);
