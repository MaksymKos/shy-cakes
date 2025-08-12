'use client';

import { useState } from 'react';

export default function ServicesSection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const services = [
        {
            icon: "",
            title: "Весільні торти",
            description: "Створюємо неповторні торти для найважливішого дня у вашому житті",
            features: ["Індивідуальний дизайн", "Натуральні інгредієнти", "Різні смаки"],
            bgGradient: "from-[#90e0ef]/10 to-[#48cae4]/10",
            iconBg: "from-[#90e0ef] to-[#48cae4]",
            hoverBg: "from-[#90e0ef]/10 to-[#48cae4]/10"
        },
        {
            icon: "",
            title: "Дитячі торти",
            description: "Яскраві та смачні торти, які зроблять свято незабутнім",
            features: ["Безпечні барвники", "Улюблені персонажі", "Інтерактивні елементи"],
            bgGradient: "from-[#48cae4]/10 to-[#023e8a]/10",
            iconBg: "from-[#48cae4] to-[#023e8a]",
            hoverBg: "from-[#48cae4]/10 to-[#023e8a]/10"
        },
        {
            icon: "",
            title: "Корпоративні торти",
            description: "Професійні торти для бізнес-заходів та корпоративів",
            features: ["Брендинг компанії", "Великі обсяги", "Швидка доставка"],
            bgGradient: "from-[#023e8a]/10 to-[#03045e]/10",
            iconBg: "from-[#023e8a] to-[#03045e]",
            hoverBg: "from-[#023e8a]/10 to-[#03045e]/10"
        },
        {
            icon: "",
            title: "Торти на замовлення",
            description: "Реалізуємо будь-які ваші ідеї та фантазії",
            features: ["Унікальний дизайн", "Консультація кондитера", "3D моделювання"],
            bgGradient: "from-[#90e0ef]/10 to-[#023e8a]/10",
            iconBg: "from-[#90e0ef] to-[#023e8a]",
            hoverBg: "from-[#90e0ef]/10 to-[#023e8a]/10"
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-[#90e0ef]/10 to-[#48cae4]/10">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] bg-clip-text text-transparent">
                        Мої Послуги
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Створюємо неперевершені торти для ваших найособливіших моментів з любов&rsquo;ю та професіоналізмом
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`
                                group relative bg-white rounded-3xl p-8 
                                hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 
                                overflow-hidden border-2 border-gray-100 hover:border-[#90e0ef]/30
                                shadow-lg
                                ${hoveredIndex === index ? 'scale-105 shadow-2xl border-[#90e0ef]/50' : ''}
                            `}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Animated background overlay */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-br ${service.hoverBg} 
                                opacity-0 group-hover:opacity-50 transition-all duration-500
                            `}></div>

                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#90e0ef]/10 rounded-full blur-xl"></div>
                            <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-[#48cae4]/10 rounded-full blur-lg"></div>

                            <div className="relative z-10">
                                <h3 className={`
                                    text-xl font-bold mb-4 text-center transition-all duration-300
                                    ${hoveredIndex === index ? 'text-transparent bg-gradient-to-r ' + service.iconBg + ' bg-clip-text' : 'text-gray-900'}
                                `}>
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6 text-center text-sm leading-relaxed font-medium">
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
