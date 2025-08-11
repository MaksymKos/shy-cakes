'use client';

import { useState } from 'react';

export default function ServicesSection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const services = [
        {
            icon: "🎂",
            title: "Весільні торти",
            description: "Створюємо неповторні торти для найважливішого дня у вашому житті",
            features: ["Індивідуальний дизайн", "Натуральні інгредієнти", "Різні смаки"],
            bgGradient: "from-pink-50 to-rose-50",
            iconBg: "from-pink-500 to-rose-500",
            hoverBg: "from-pink-500/10 to-rose-500/10"
        },
        {
            icon: "🎈",
            title: "Дитячі торти",
            description: "Яскраві та смачні торти, які зроблять свято незабутнім",
            features: ["Безпечні барвники", "Улюблені персонажі", "Інтерактивні елементи"],
            bgGradient: "from-purple-50 to-violet-50",
            iconBg: "from-purple-500 to-violet-500",
            hoverBg: "from-purple-500/10 to-violet-500/10"
        },
        {
            icon: "🎊",
            title: "Корпоративні торти",
            description: "Професійні торти для бізнес-заходів та корпоративів",
            features: ["Брендинг компанії", "Великі обсяги", "Швидка доставка"],
            bgGradient: "from-indigo-50 to-blue-50",
            iconBg: "from-indigo-500 to-blue-500",
            hoverBg: "from-indigo-500/10 to-blue-500/10"
        },
        {
            icon: "🌸",
            title: "Торти на замовлення",
            description: "Реалізуємо будь-які ваші ідеї та фантазії",
            features: ["Унікальний дизайн", "Консультація кондитера", "3D моделювання"],
            bgGradient: "from-emerald-50 to-teal-50",
            iconBg: "from-emerald-500 to-teal-500",
            hoverBg: "from-emerald-500/10 to-teal-500/10"
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Чому обирають нас?
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Ми не просто створюємо торти - ми створюємо емоції та незабутні враження
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`
                                group relative bg-gradient-to-br ${service.bgGradient} rounded-3xl p-8 
                                hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 
                                overflow-hidden cursor-pointer border border-white/50
                                ${hoveredIndex === index ? 'scale-105' : ''}
                            `}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Animated background overlay */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-br ${service.hoverBg} 
                                opacity-0 group-hover:opacity-100 transition-all duration-500
                            `}></div>

                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
                            <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>

                            <div className="relative z-10">
                                <div className={`
                                    text-5xl mb-6 text-center transform group-hover:scale-110 transition-all duration-500
                                    ${hoveredIndex === index ? 'animate-bounce' : ''}
                                `}>
                                    {service.icon}
                                </div>
                                <h3 className={`
                                    text-xl font-bold text-gray-900 mb-4 text-center transition-all duration-300
                                    ${hoveredIndex === index ? 'text-transparent bg-gradient-to-r ' + service.iconBg + ' bg-clip-text' : ''}
                                `}>
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6 text-center text-sm leading-relaxed">
                                    {service.description}
                                </p>
                                <ul className="space-y-3">
                                    {service.features.map((feature, featureIndex) => (
                                        <li 
                                            key={featureIndex} 
                                            className="flex items-center text-sm text-gray-600"
                                            style={{
                                                animationDelay: hoveredIndex === index ? `${featureIndex * 100}ms` : '0ms'
                                            }}
                                        >
                                            <div className={`
                                                w-5 h-5 bg-gradient-to-r ${service.iconBg} rounded-full 
                                                flex items-center justify-center mr-3 flex-shrink-0
                                                transform transition-all duration-300
                                                ${hoveredIndex === index ? 'scale-110 shadow-lg' : ''}
                                            `}>
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className={`
                                                transition-all duration-300
                                                ${hoveredIndex === index ? 'font-medium' : ''}
                                            `}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
