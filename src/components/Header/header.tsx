'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Dialog, DialogPanel, PopoverGroup, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 z-50 w-full">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <Image
                                src="/images/logo.png"
                                width={100}
                                height={80}
                                alt='Shy Cakes Logo'
                                quality={100}
                                className="h-auto w-auto"
                            />
                        </Link>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="size-7 cursor-pointer" />
                        </button>
                    </div>
                    <PopoverGroup className="hidden lg:flex lg:gap-x-8">
                        <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/">Головна</Link>
                        <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/catalog/">Каталог</Link>
                        <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/reviews/">Відгуки</Link>
                        <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/portfolio/">Портфоліо</Link>
                        <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/contact/">Контакти</Link>
                        <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/about/">Про мене</Link>
                    </PopoverGroup>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center">
                        <div className="animate-pulse h-10 w-36 bg-gray-200 rounded-lg"></div>
                    </div>
                </nav>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 z-50 w-full">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <Image
                            src="/images/logo.png"
                            width={100}
                            height={80}
                            alt='Shy Cakes Logo'
                            quality={100}
                            className="h-auto w-auto"
                        />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-7 cursor-pointer" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-8">
                    <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/">Головна</Link>
                    <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/catalog/">Каталог</Link>
                    <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/reviews/">Відгуки</Link>
                    <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/portfolio/">Портфоліо</Link>
                    <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/contact/">Контакти</Link>
                    <Link className="text-gray-700 transition font-medium hover:text-pink-600 px-3 py-2 rounded-md hover:bg-pink-50" href="/about/">Про мене</Link>
                </PopoverGroup>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center">
                    {session ? (
                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                    <PopoverButton className="flex items-center gap-2 text-gray-700 hover:text-pink-600 font-medium px-3 py-2 rounded-md transition-colors focus:outline-none cursor-pointer">
                                        <UserIcon className="h-5 w-5" />
                                        <span>Особистий кабінет</span>
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </PopoverButton>

                                    <PopoverPanel className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                        <div className="p-2">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">Привіт, {session.user?.name}!</p>
                                                <p className="text-xs text-gray-500">{session.user?.email}</p>
                                            </div>

                                            <div className="py-2">
                                                {session.user?.role !== 'admin' && (
                                                    <>
                                                        <Link
                                                            href="/profile"
                                                            onClick={() => close()}
                                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors cursor-pointer"
                                                        >
                                                            <UserIcon className="h-4 w-4" />
                                                            Мій профіль
                                                        </Link>

                                                        <Link
                                                            href="/orders"
                                                            onClick={() => close()}
                                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors cursor-pointer"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                            </svg>
                                                            Мої замовлення
                                                        </Link>

                                                        <Link
                                                            href="/liked"
                                                            onClick={() => close()}
                                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors cursor-pointer"
                                                        >
                                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                            </svg>
                                                            Улюблені товари
                                                        </Link>
                                                    </>
                                                )}

                                                {session.user?.role === 'admin' && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => close()}
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        Адмін панель
                                                    </Link>
                                                )}

                                                <div className="border-t border-gray-100 mt-2 pt-2">
                                                    <button
                                                        onClick={() => {
                                                            close();
                                                            signOut();
                                                        }}
                                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors text-left cursor-pointer"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        Вийти
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverPanel>
                                </>
                            )}
                        </Popover>
                    ) : (
                        <div className="flex gap-3">
                            <Link
                                href="/auth/signin"
                                className="text-pink-600 border border-pink-600 hover:bg-pink-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200"
                            >
                                Увійти
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200"
                            >
                                Реєстрація
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                            <Image
                                src="/images/logo.png"
                                width={80}
                                height={60}
                                alt='Shy Cakes Logo'
                                quality={100}
                                className="h-auto w-auto"
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-7 cursor-pointer" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Головна</Link>
                                <Link href="/catalog/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Каталог</Link>
                                <Link href="/reviews/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Відгуки</Link>
                                <Link href="/portfolio/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Портфоліо</Link>
                                <Link href="/contact/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Контакти</Link>
                                <Link href="/about/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-pink-50 hover:text-pink-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Про мене</Link>
                            </div>
                            <div className="py-6">
                                {session ? (
                                    <div className="space-y-3">
                                        <div className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900">
                                            Особистий кабінет
                                        </div>
                                        <div className="mx-3 block rounded-lg px-3 py-1.5 text-sm text-gray-600">
                                            Привіт, {session.user?.name}!
                                        </div>

                                        {session.user?.role !== 'admin' && (
                                            <>
                                                <Link
                                                    href="/profile"
                                                    className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Мій профіль
                                                </Link>

                                                <Link
                                                    href="/orders"
                                                    className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Мої замовлення
                                                </Link>

                                                <Link
                                                    href="/liked"
                                                    className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Улюблені товари
                                                </Link>
                                            </>
                                        )}

                                        {session.user?.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-purple-600 hover:bg-purple-50 transition-colors"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Адмін панель
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                signOut();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                                        >
                                            Вийти
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            href="/auth/signin"
                                            className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-pink-600 hover:bg-pink-50 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Увійти
                                        </Link>
                                        <Link
                                            href="/auth/signup"
                                            className="mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white bg-pink-600 hover:bg-pink-700 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Реєстрація
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}