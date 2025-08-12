'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function StatsSection() {
    const [stats, setStats] = useState([
        { current: 0, target: 200, label: 'Виконаних робіт', icon: '' },
        { current: 0, target: 150, label: 'Задоволених клієнтів', icon: '' },
        { current: 0, target: 50, label: 'Унікальних дизайнів', icon: '' },
        { current: 0, target: 100, label: 'Натуральні інгредієнти', icon: '' }
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
        <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
            <div className="relative z-10 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] bg-clip-text text-transparent">
                        Мої досягнення
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Цифри, які говорять про мою якість та професіоналізм
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50"
                            style={{
                                animationDelay: `${index * 0.1}s`,
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#90e0ef] to-[#48cae4] bg-clip-text text-transparent mb-4">
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
