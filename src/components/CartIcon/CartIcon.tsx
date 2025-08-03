'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartIcon() {
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    return (
        <Link
            href="/cart"
            className="relative inline-flex items-center p-2 text-gray-600 hover:text-pink-600 transition-colors"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}
        </Link>
    );
}
