

'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    usePhotoReviews,
    usePortfolio,
    useOrders,
    useCacheManager,
    usePhotoReviewsStore,
    usePortfolioStore,
    useOrdersStore
} from '@/store';
import type { PhotoReview, PortfolioItem, CakeOrder } from '@/types/database';

export default function AdminDataManager() {
    const [activeTab, setActiveTab] = useState<'reviews' | 'portfolio' | 'orders'>('reviews');

    // Using custom hooks for automatic data fetching and caching
    const photoReviewsData = usePhotoReviews({
        approvedOnly: false,
        autoFetch: true,
        refreshInterval: 2 * 60 * 1000 // Refresh every 2 minutes for admin
    });

    const portfolioData = usePortfolio({
        autoFetch: true,
        refreshInterval: 5 * 60 * 1000 // Refresh every 5 minutes
    });

    const ordersData = useOrders({
        autoFetch: true,
        refreshInterval: 1 * 60 * 1000 // Refresh every minute for orders
    });

    // Direct store access for actions
    const { updatePhotoReview, deletePhotoReview } = usePhotoReviewsStore();
    const { deletePortfolioItem } = usePortfolioStore();
    const { updateOrder } = useOrdersStore();

    // Cache management
    const { clearAllCaches, refetchAllData } = useCacheManager();

    // Example action handlers
    const handleApproveReview = async (reviewId: string) => {
        try {
            await updatePhotoReview(reviewId, { isApproved: true });
            // The store will automatically update the UI
        } catch {
            // Error handling - could show toast notification
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            await deletePhotoReview(reviewId);
            // The store will automatically update the UI
        } catch {
            // Error handling - could show toast notification
        }
    };

    const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await updateOrder(orderId, {
                status: newStatus as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
            });
            // The store will automatically update the UI
        } catch {
            // Error handling - could show toast notification
        }
    };

    const handleClearAllCaches = () => {
        clearAllCaches();
    };

    const handleRefreshAllData = async () => {
        await refetchAllData();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        {(['reviews', 'portfolio', 'orders'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${activeTab === tab
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    { }
                    <div className="mb-6 flex space-x-4">
                        <button
                            onClick={handleClearAllCaches}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                            Clear All Caches
                        </button>
                        <button
                            onClick={handleRefreshAllData}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Refresh All Data
                        </button>
                    </div>

                    { }
                    {activeTab === 'reviews' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Photo Reviews</h2>
                                <div className="text-sm text-gray-500">
                                    {photoReviewsData.isLoading ? 'Loading...' : `${photoReviewsData.data.length} reviews`}
                                </div>
                            </div>

                            {photoReviewsData.error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600">Error: {photoReviewsData.error}</p>
                                    <button
                                        onClick={photoReviewsData.clearError}
                                        className="mt-2 text-sm text-red-800 underline"
                                    >
                                        Clear Error
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {photoReviewsData.data.map((review: PhotoReview) => (
                                    <div key={review._id?.toString()} className="border rounded-lg p-4">
                                        <h3 className="font-medium">{review.cakeName}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{review.cakeDescription}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-1 rounded text-xs ${review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {review.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                            <div className="space-x-2">
                                                {!review.isApproved && (
                                                    <button
                                                        onClick={() => handleApproveReview(review._id?.toString() || '')}
                                                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteReview(review._id?.toString() || '')}
                                                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    { }
                    {activeTab === 'portfolio' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Portfolio Items</h2>
                                <div className="text-sm text-gray-500">
                                    {portfolioData.isLoading ? 'Loading...' : `${portfolioData.data.length} items`}
                                </div>
                            </div>

                            {portfolioData.error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600">Error: {portfolioData.error}</p>
                                    <button
                                        onClick={portfolioData.clearError}
                                        className="mt-2 text-sm text-red-800 underline"
                                    >
                                        Clear Error
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {portfolioData.data.map((item: PortfolioItem) => (
                                    <div key={item._id?.toString()} className="border rounded-lg p-4">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={200}
                                            height={128}
                                            className="w-full h-32 object-cover rounded mb-2"
                                        />
                                        <h3 className="font-medium">{item.title}</h3>
                                        <button
                                            onClick={() => deletePortfolioItem(item._id?.toString() || '')}
                                            className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    { }
                    {activeTab === 'orders' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Orders</h2>
                                <div className="text-sm text-gray-500">
                                    {ordersData.isLoading ? 'Loading...' : `${ordersData.data.length} orders`}
                                </div>
                            </div>

                            {ordersData.error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600">Error: {ordersData.error}</p>
                                    <button
                                        onClick={ordersData.clearError}
                                        className="mt-2 text-sm text-red-800 underline"
                                    >
                                        Clear Error
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4">
                                {ordersData.data.map((order: CakeOrder) => (
                                    <div key={order._id?.toString()} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">{order.cakeType}</h3>
                                                <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                                                <p className="text-sm text-gray-600">{order.price} ₴</p>
                                            </div>
                                            <div className="text-right">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleOrderStatusUpdate(order._id?.toString() || '', e.target.value)}
                                                    className="text-sm border rounded px-2 py-1"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
