import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            { }
            <div className="absolute inset-0 bg-gradient-to-r from-[#90e0ef] via-[#48cae4] to-[#023e8a]">
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            { }
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 container mx-auto text-center px-4">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                    Готові створити
                    <span className="block bg-gradient-to-r from-[#90e0ef] to-white bg-clip-text text-transparent">
                        ваш ідеальний торт?
                    </span>
                </h2>

                <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Зв&apos;яжіться з нами сьогодні, і ми перетворимо ваші найсміливіші ідеї у солодку реальність
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link
                        href="/order"
                        className="group relative px-10 py-5 bg-white text-gray-900 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Зробити замовлення
                        </span>
                    </Link>

                    <Link
                        href="/portfolio"
                        className="px-10 py-5 border-2 border-white text-white rounded-full text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-gray-900 hover:scale-105 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Мої роботи
                    </Link>
                </div>

                { }
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <a
                            href="tel:+380636787525"
                            className="inline-block"
                        >
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors duration-300 cursor-pointer">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </a>
                        <h3 className="text-lg font-semibold text-white mb-2">Телефон</h3>
                        <a
                            href="tel:+380636787525"
                            className="text-white hover:text-[#90e0ef] transition-colors duration-300 cursor-pointer"
                        >
                            +380 63 678 7525
                        </a>
                    </div>

                    <div className="text-center">
                        <a
                            href="https://instagram.com/shy__cakes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                        >
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors duration-300 cursor-pointer">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>
                        </a>
                        <h3 className="text-lg font-semibold text-white mb-2">Instagram</h3>
                        <a
                            href="https://instagram.com/shy__cakes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-[#90e0ef] transition-colors duration-300 cursor-pointer"
                        >
                            @shy__cakes
                        </a>
                    </div>

                    <div className="text-center">
                        <a
                            href="https://t.me/elin_pak"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                        >
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors duration-300 cursor-pointer">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                </svg>
                            </div>
                        </a>
                        <h3 className="text-lg font-semibold text-white mb-2">Telegram</h3>
                        <a
                            href="https://t.me/elin_pak"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-[#90e0ef] transition-colors duration-300 cursor-pointer"
                        >
                            @elin_pak
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
