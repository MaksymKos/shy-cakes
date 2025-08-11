'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function StatsSection() {
    const [stats, setStats] = useState([
        { current: 0, target: 200, label: 'Виконаних робіт', icon: '🎂' },
        { current: 0, target: 150, label: 'Задоволених клієнтів', icon: '😊' },
        { current: 0, target: 50, label: 'Унікальних дизайнів', icon: '🎨' },
        { current: 0, target: 100, label: 'Натуральні інгредієнти', icon: '⭐' }
    ]);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const animateStats = useCallback(() => {
        stats.forEach((stat, index) => {
            const duration = 2000; // 2 секунди
            const startTime = Date.now();
            const startValue = 0;
            const endValue = stat.target;

            const updateValue = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

                setStats(prevStats => 
                    prevStats.map((s, i) => 
                        i === index ? { ...s, current: currentValue } : s
                    )
                );

                if (progress < 1) {
                    requestAnimationFrame(updateValue);
                }
            };

            // Додаємо затримку для кожної статистики
            setTimeout(updateValue, index * 200);
        });
    }, [stats]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                    animateStats();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible, animateStats]);

    return (
        <section ref={sectionRef} className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-200/30 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-200/30 rounded-full blur-lg"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Наші досягнення
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Цифри, які говорять про нашу якість та професіоналізм
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50"
                            style={{ 
                                animationDelay: `${index * 0.1}s`,
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                {stat.label === 'Натуральні інгредієнти' ? `${stat.current}%` : stat.current.toLocaleString()}
                                {stat.target >= 100 && stat.current === stat.target && stat.label !== 'Натуральні інгредієнти' ? '+' : ''}
                            </div>
                            <p className="text-gray-600 font-medium text-lg">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
