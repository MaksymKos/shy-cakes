'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSection() {
    const [particles, setParticles] = useState<Array<{ left: string, top: string, delay: string, duration: string }>>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Генеруємо частинки тільки на клієнті
        const particleData = Array.from({ length: 20 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${3 + Math.random() * 4}s`
        }));
        setParticles(particleData);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
                <div className="absolute inset-0 bg-black/20"></div>
                {/* Floating particles */}
                <div className="absolute inset-0">
                    {isClient && particles.map((particle, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
                            style={{
                                left: particle.left,
                                top: particle.top,
                                animationDelay: particle.delay,
                                animationDuration: particle.duration
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                        <span className="block bg-gradient-to-r from-pink-200 to-white bg-clip-text text-transparent">
                            Shy Cakes
                        </span>
                        <span className="block text-3xl md:text-4xl lg:text-5xl mt-4 font-light">
                            Створюємо солодкі мрії
                        </span>
                    </h1>
                </div>

                <div className="animate-fade-in-up delay-300">
                    <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90 font-light">
                        Авторські торти, що перетворюють особливі моменти у незабутні спогади
                    </p>
                </div>

                <div className="animate-fade-in-up delay-500">
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            href="/catalog"
                            className="group relative px-10 py-5 bg-white text-gray-900 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden"
                        >
                            <span className="relative z-10">Переглянути каталог</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300 flex items-center justify-center">
                                Переглянути каталог
                            </span>
                        </Link>

                        <Link
                            href="/contact"
                            className="px-10 py-5 border-2 border-white text-white rounded-full text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-gray-900 hover:scale-105"
                        >
                            Зробити замовлення
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="animate-fade-in-up delay-700 mt-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">200+</div>
                            <div className="text-xs md:text-sm opacity-80">Виконаних робіт</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">150+</div>
                            <div className="text-xs md:text-sm opacity-80">Задоволених клієнтів</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">50+</div>
                            <div className="text-xs md:text-sm opacity-80">Унікальних дизайнів</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">100%</div>
                            <div className="text-xs md:text-sm opacity-80">Натуральні інгредієнти</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <div className="animate-bounce">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
