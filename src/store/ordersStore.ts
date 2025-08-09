import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { CakeOrder } from "@/types/database";

export interface OrdersState {
    orders: CakeOrder[];
    userOrders: CakeOrder[];
    isLoading: boolean;
    isLoadingUserOrders: boolean;
    error: string | null;
    lastFetchAll: number | null;
    lastFetchUser: number | null;
    cacheTimeout: number;

    fetchOrders: (force?: boolean) => Promise<void>;
    fetchUserOrders: (userId: string, force?: boolean) => Promise<void>;
    createOrder: (
        order: Omit<CakeOrder, "_id" | "createdAt" | "updatedAt">
    ) => Promise<CakeOrder | null>;
    updateOrder: (id: string, updates: Partial<CakeOrder>) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    clearCache: () => void;
    clearError: () => void;
}

export const useOrdersStore = create<OrdersState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                orders: [],
                userOrders: [],
                isLoading: false,
                isLoadingUserOrders: false,
                error: null,
                lastFetchAll: null,
                lastFetchUser: null,
                cacheTimeout: 3 * 60 * 1000, // 3 minutes

                // Fetch all orders (admin)
                fetchOrders: async (force = false) => {
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
                        const response = await fetch("/api/orders");
                        if (!response.ok) {
                            throw new Error("Failed to fetch orders");
                        }

                        const data = await response.json();
                        set({
                            orders: data,
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

                // Fetch user orders
                fetchUserOrders: async (userId, force = false) => {
                    const state = get();
                    const now = Date.now();

                    // Check if we need to fetch (cache is expired or force is true)
                    if (
                        !force &&
                        state.lastFetchUser &&
                        now - state.lastFetchUser < state.cacheTimeout
                    ) {
                        return;
                    }

                    set({ isLoadingUserOrders: true, error: null });

                    try {
                        const response = await fetch(
                            `/api/orders?userId=${userId}`
                        );
                        if (!response.ok) {
                            throw new Error("Failed to fetch user orders");
                        }

                        const data = await response.json();
                        set({
                            userOrders: data,
                            lastFetchUser: now,
                            isLoadingUserOrders: false,
                        });
                    } catch (error) {
                        set({
                            error:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error",
                            isLoadingUserOrders: false,
                        });
                    }
                },

                // Create new order
                createOrder: async (orderData) => {
                    set({ error: null });

                    try {
                        const response = await fetch("/api/orders", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(orderData),
                        });

                        if (!response.ok) {
                            throw new Error("Failed to create order");
                        }

                        const result = await response.json();

                        // Refetch data to update the store
                        await get().fetchOrders(true);

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

                // Update order
                updateOrder: async (id, updates) => {
                    set({ error: null });

                    try {
                        const response = await fetch(`/api/orders/${id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(updates),
                        });

                        if (!response.ok) {
                            throw new Error("Failed to update order");
                        }

                        // Update local state
                        set((state) => ({
                            orders: state.orders.map((order) =>
                                order._id?.toString() === id
                                    ? { ...order, ...updates }
                                    : order
                            ),
                            userOrders: state.userOrders.map((order) =>
                                order._id?.toString() === id
                                    ? { ...order, ...updates }
                                    : order
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

                // Delete order
                deleteOrder: async (id) => {
                    set({ error: null });

                    try {
                        const response = await fetch(`/api/orders/${id}`, {
                            method: "DELETE",
                        });

                        if (!response.ok) {
                            throw new Error("Failed to delete order");
                        }

                        // Remove from local state
                        set((state) => ({
                            orders: state.orders.filter(
                                (order) => order._id?.toString() !== id
                            ),
                            userOrders: state.userOrders.filter(
                                (order) => order._id?.toString() !== id
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
                        lastFetchUser: null,
                        orders: [],
                        userOrders: [],
                    });
                },

                // Clear error
                clearError: () => {
                    set({ error: null });
                },
            }),
            {
                name: "orders-store",
                partialize: (state) => ({
                    orders: state.orders,
                    userOrders: state.userOrders,
                    lastFetchAll: state.lastFetchAll,
                    lastFetchUser: state.lastFetchUser,
                }),
            }
        ),
        {
            name: "orders-store",
        }
    )
);
