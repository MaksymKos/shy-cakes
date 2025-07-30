'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Dialog, DialogPanel, PopoverGroup } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <header className="bg-white border-b border-gray-300 fixed top-0 left-0 z-10 w-full">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <Image
                                src="/images/logo.png"
                                width={120}
                                height={120}
                                alt='logo'
                                quality={100}
                            />
                        </Link>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="size-9 cursor-pointer" />
                        </button>
                    </div>
                    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                        <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/">Головна</Link>
                        <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/catalog/"> Каталог </Link>
                        <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/reviews/"> Відгуки </Link>
                        <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/portfolio/"> Портфоліо </Link>
                        <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/contact/"> Контакти </Link>
                        <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/about/"> Про мене </Link>
                    </PopoverGroup>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
                    </div>
                </nav>
            </header>
        );
    }

    return (
        <header className="bg-white border-b border-gray-300 fixed top-0 left-0 z-10 w-full">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <Image
                            src="/images/logo.png"
                            width={120}
                            height={120}
                            alt='logo'
                            quality={100}
                        />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-9 cursor-pointer" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/">Головна</Link>
                    <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/catalog/"> Каталог </Link>
                    <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/reviews/"> Відгуки </Link>
                    <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/portfolio/"> Портфоліо </Link>
                    <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/contact/"> Контакти </Link>
                    <Link className="text-gray-700 transition font-semibold hover:text-gray-500/75" href="/about/"> Про мене </Link>
                </PopoverGroup>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">Привіт, {session.user?.name}!</span>
                            {session.user?.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="text-purple-600 border border-purple-600 hover:bg-purple-50 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors duration-200"
                                >
                                    Адмін панель
                                </Link>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Вийти
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link
                                href="/auth/signin"
                                className="text-cyan-600 border border-cyan-600 hover:bg-cyan-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-200"
                            >
                                Увійти
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Реєстрація
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <Image
                                src="/images/logo.png"
                                width={100}
                                height={100}
                                alt='logo'
                                quality={100}
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-9 cursor-pointer" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 text-gray-900 hover:bg-gray-50">Головна</Link>
                                <a className="-mx-3 block rounded-lg px-3 py-2 text-base/7 text-gray-900 hover:bg-gray-50" href="#"> Каталог </a>
                                <a className="-mx-3 block rounded-lg px-3 py-2 text-base/7 text-gray-900 hover:bg-gray-50" href="#"> Відгуки </a>
                                <Link className="-mx-3 block rounded-lg px-3 py-2 text-base/7 text-gray-900 hover:bg-gray-50" href="/portfolio/"> Портфоліо </Link>
                                <Link className="-mx-3 block rounded-lg px-3 py-2 text-base/7 text-gray-900 hover:bg-gray-50" href="/contact/"> Контакти </Link>
                                <a className="-mx-3 block rounded-lg px-3 py-2 text-base/7 text-gray-900 hover:bg-gray-50" href="#"> Про мене </a>
                            </div>
                            <div className="py-6">
                                {session ? (
                                    <div className="space-y-2">
                                        <div className="mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900">
                                            Привіт, {session.user?.name}!
                                        </div>
                                        <button
                                            onClick={() => signOut()}
                                            className="mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 w-full text-left"
                                        >
                                            Вийти
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Link 
                                            href="/auth/signin" 
                                            className="mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                        >
                                            Увійти
                                        </Link>
                                        <Link 
                                            href="/auth/signup" 
                                            className="mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
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