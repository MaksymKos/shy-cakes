'use client';

import { useState } from 'react';

export default function ProcessSection() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            id: 1,
            title: 'Консультація',
            description: 'Обговорюємо ваші побажання, смаки, дизайн та бюджет',
            icon: '💬',
            details: [
                'Безкоштовна консультація',
                'Обговорення дизайну',
                'Вибір смаків',
                'Розрахунок вартості'
            ],
            color: 'from-pink-500 to-rose-500'
        },
        {
            id: 2,
            title: 'Дизайн',
            description: 'Створюємо ескіз вашого майбутнього торта',
            icon: '🎨',
            details: [
                '3D візуалізація',
                'Кольорова палітра',
                'Декоративні елементи',
                'Узгодження змін'
            ],
            color: 'from-purple-500 to-violet-500'
        },
        {
            id: 3,
            title: 'Створення',
            description: 'Майстерно втілюємо проект у життя',
            icon: '👩‍🍳',
            details: [
                'Натуральні інгредієнти',
                'Ручна робота',
                'Контроль якості',
                'Свіжий продукт'
            ],
            color: 'from-indigo-500 to-blue-500'
        },
        {
            id: 4,
            title: 'Доставка',
            description: 'Безпечно доставляємо у зазначений час та місце',
            icon: '🚚',
            details: [
                'Точна доставка',
                'Безпечна упаковка',
                'Професійна збірка',
                'Гарантія якості'
            ],
            color: 'from-emerald-500 to-teal-500'
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Як ми працюємо
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Простий та зрозумілий процес створення вашого ідеального торта
                    </p>
                </div>

                {/* Desktop version */}
                <div className="hidden lg:block">
                    <div className="relative">
                        {/* Progress line */}
                        <div className="absolute top-24 left-0 right-0 h-1 bg-gray-200 rounded-full">
                            <div 
                                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                            ></div>
                        </div>

                        <div className="grid grid-cols-4 gap-8">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className="relative"
                                    onMouseEnter={() => setActiveStep(index)}
                                >
                                    <div className={`
                                        relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer
                                        ${activeStep === index ? 'scale-105 shadow-2xl' : ''}
                                        border-2 ${activeStep === index ? 'border-pink-300' : 'border-gray-100'}
                                    `}>
                                        {/* Step number */}
                                        <div className={`
                                            absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                                            bg-gradient-to-r ${step.color}
                                            ${activeStep === index ? 'animate-pulse' : ''}
                                        `}>
                                            {step.id}
                                        </div>

                                        <div className="pt-8 text-center">
                                            <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">
                                                {step.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                                {step.description}
                                            </p>

                                            {/* Details */}
                                            <div className={`
                                                transition-all duration-500 overflow-hidden
                                                ${activeStep === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                            `}>
                                                <ul className="space-y-2">
                                                    {step.details.map((detail, detailIndex) => (
                                                        <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                                                            <div className={`w-3 h-3 bg-gradient-to-r ${step.color} rounded-full mr-3 flex-shrink-0`}></div>
                                                            {detail}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile version */}
                <div className="lg:hidden space-y-8">
                    {steps.map((step, _index) => (
                        <div key={step.id} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start space-x-4">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                                    bg-gradient-to-r ${step.color} flex-shrink-0
                                `}>
                                    {step.id}
                                </div>
                                <div className="flex-1">
                                    <div className="text-4xl mb-2">{step.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {step.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {step.details.map((detail, detailIndex) => (
                                            <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                                                <div className={`w-3 h-3 bg-gradient-to-r ${step.color} rounded-full mr-3 flex-shrink-0`}></div>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <p className="text-lg text-gray-600 mb-6">
                        Готові розпочати створення вашого торта?
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Розпочати консультацію
                    </a>
                </div>
            </div>
        </section>
    );
}
