'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PageBanner() {
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
        <section className="relative h-[calc(100dvh-80px)] flex items-center justify-center overflow-hidden">
            {/* Відео фон */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/videos/large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Додатковий темний оверлей для читабельності тексту */}
            <div className="absolute inset-0 bg-black/30 z-20"></div>

            {/* Анімовані частинки */}
            <div className="absolute inset-0 z-30">
                {isClient && particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                        style={{
                            left: particle.left,
                            top: particle.top,
                            animationDelay: particle.delay,
                            animationDuration: particle.duration
                        }}
                    />
                ))}
            </div>

            {/* Контент */}
            <div className="relative z-40 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="animate-fade-in-up opacity-0">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                        <span className="block bg-gradient-to-r from-[#90e0ef] to-white bg-clip-text text-transparent">
                            Shy Cakes
                        </span>
                    </h1>
                </div>

                <div className="animate-fade-in-up delay-500 opacity-0">
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            href="/catalog"
                            className="px-8 py-4 bg-[#90e0ef] text-gray-900 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#48cae4] hover:scale-105"
                        >
                            Переглянути каталог
                        </Link>

                        <Link
                            href="/order"
                            className="px-8 py-4 border-2 border-[#90e0ef] text-[#90e0ef] rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#90e0ef] hover:text-gray-900 hover:scale-105"
                        >
                            Зробити замовлення
                        </Link>
                    </div>
                </div>
            </div>

        </section>
    );
}
