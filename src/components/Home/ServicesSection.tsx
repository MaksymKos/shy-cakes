export default function ServicesSection() {
    const services = [
        {
            icon: "🎂",
            title: "Весільні торти",
            description: "Створюємо неповторні торти для найважливішого дня у вашому житті",
            features: ["Індивідуальний дизайн", "Натуральні інгредієнти", "Різні смаки"]
        },
        {
            icon: "🎈",
            title: "Дитячі торти",
            description: "Яскраві та смачні торти, які зроблять свято незабутнім",
            features: ["Безпечні барвники", "Улюблені персонажі", "Інтерактивні елементи"]
        },
        {
            icon: "🎊",
            title: "Корпоративні торти",
            description: "Професійні торти для бізнес-заходів та корпоративів",
            features: ["Брендинг компанії", "Великі обсяги", "Швидка доставка"]
        },
        {
            icon: "🌸",
            title: "Торти на замовлення",
            description: "Реалізуємо будь-які ваші ідеї та фантазії",
            features: ["Унікальний дизайн", "Консультація кондитера", "3D моделювання"]
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
                            className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden"
                        >
                            {/* Background animation */}
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10">
                                <div className="text-5xl mb-6 text-center transform group-hover:scale-110 transition-transform duration-500">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-pink-600 transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6 text-center text-sm">
                                    {service.description}
                                </p>
                                <ul className="space-y-3">
                                    {service.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                                            <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            {feature}
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
