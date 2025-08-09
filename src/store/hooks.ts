import { useEffect } from "react";
import {
    usePhotoReviewsStore,
    usePortfolioStore,
    useOrdersStore,
    useGeneralStore,
} from "@/store";

// Custom hook for photo reviews with automatic fetching
export const usePhotoReviews = (options?: {
    approvedOnly?: boolean;
    autoFetch?: boolean;
    refreshInterval?: number;
}) => {
    const {
        approvedOnly = false,
        autoFetch = true,
        refreshInterval,
    } = options || {};

    const {
        photoReviews,
        approvedPhotoReviews,
        isLoading,
        isLoadingApproved,
        error,
        fetchPhotoReviews,
        fetchApprovedPhotoReviews,
        clearError,
    } = usePhotoReviewsStore();

    useEffect(() => {
        if (autoFetch) {
            if (approvedOnly) {
                fetchApprovedPhotoReviews();
            } else {
                fetchPhotoReviews();
            }
        }
    }, [autoFetch, approvedOnly, fetchPhotoReviews, fetchApprovedPhotoReviews]);

    // Set up refresh interval if provided
    useEffect(() => {
        if (refreshInterval && autoFetch) {
            const interval = setInterval(() => {
                if (approvedOnly) {
                    fetchApprovedPhotoReviews(true);
                } else {
                    fetchPhotoReviews(true);
                }
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [
        refreshInterval,
        autoFetch,
        approvedOnly,
        fetchPhotoReviews,
        fetchApprovedPhotoReviews,
    ]);

    return {
        data: approvedOnly ? approvedPhotoReviews : photoReviews,
        isLoading: approvedOnly ? isLoadingApproved : isLoading,
        error,
        refetch: () =>
            approvedOnly
                ? fetchApprovedPhotoReviews(true)
                : fetchPhotoReviews(true),
        clearError,
    };
};

// Custom hook for portfolio with automatic fetching
export const usePortfolio = (options?: {
    autoFetch?: boolean;
    refreshInterval?: number;
}) => {
    const { autoFetch = true, refreshInterval } = options || {};

    const {
        portfolioItems,
        isLoading,
        error,
        fetchPortfolioItems,
        clearError,
    } = usePortfolioStore();

    useEffect(() => {
        if (autoFetch) {
            fetchPortfolioItems();
        }
    }, [autoFetch, fetchPortfolioItems]);

    // Set up refresh interval if provided
    useEffect(() => {
        if (refreshInterval && autoFetch) {
            const interval = setInterval(() => {
                fetchPortfolioItems(true);
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [refreshInterval, autoFetch, fetchPortfolioItems]);

    return {
        data: portfolioItems,
        isLoading,
        error,
        refetch: () => fetchPortfolioItems(true),
        clearError,
    };
};

// Custom hook for orders with automatic fetching
export const useOrders = (options?: {
    userId?: string;
    autoFetch?: boolean;
    refreshInterval?: number;
}) => {
    const { userId, autoFetch = true, refreshInterval } = options || {};

    const {
        orders,
        userOrders,
        isLoading,
        isLoadingUserOrders,
        error,
        fetchOrders,
        fetchUserOrders,
        clearError,
    } = useOrdersStore();

    useEffect(() => {
        if (autoFetch) {
            if (userId) {
                fetchUserOrders(userId);
            } else {
                fetchOrders();
            }
        }
    }, [autoFetch, userId, fetchOrders, fetchUserOrders]);

    // Set up refresh interval if provided
    useEffect(() => {
        if (refreshInterval && autoFetch) {
            const interval = setInterval(() => {
                if (userId) {
                    fetchUserOrders(userId, true);
                } else {
                    fetchOrders(true);
                }
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [refreshInterval, autoFetch, userId, fetchOrders, fetchUserOrders]);

    return {
        data: userId ? userOrders : orders,
        isLoading: userId ? isLoadingUserOrders : isLoading,
        error,
        refetch: () =>
            userId ? fetchUserOrders(userId, true) : fetchOrders(true),
        clearError,
    };
};

// Custom hook for managing global app state
export const useAppState = () => {
    const {
        isGlobalLoading,
        globalError,
        theme,
        language,
        statistics,
        setGlobalLoading,
        setGlobalError,
        setTheme,
        setLanguage,
        clearAllCaches,
        resetApp,
    } = useGeneralStore();

    return {
        isGlobalLoading,
        globalError,
        theme,
        language,
        statistics,
        setGlobalLoading,
        setGlobalError,
        setTheme,
        setLanguage,
        clearAllCaches,
        resetApp,
    };
};

// Hook for cache management across all stores
export const useCacheManager = () => {
    const photoReviewsStore = usePhotoReviewsStore();
    const portfolioStore = usePortfolioStore();
    const ordersStore = useOrdersStore();
    const generalStore = useGeneralStore();

    const clearAllCaches = () => {
        photoReviewsStore.clearCache();
        portfolioStore.clearCache();
        ordersStore.clearCache();
        generalStore.clearAllCaches();
    };

    const refetchAllData = async () => {
        await Promise.all([
            photoReviewsStore.fetchPhotoReviews(true),
            photoReviewsStore.fetchApprovedPhotoReviews(true),
            portfolioStore.fetchPortfolioItems(true),
            ordersStore.fetchOrders(true),
        ]);
    };

    return {
        clearAllCaches,
        refetchAllData,
    };
};
