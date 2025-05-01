import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="bg-gray-100 py-20 text center">
            <div className="max-w-4xl mx-auto px4">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Welcome to Budgenix
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Take control of your budget with ease. Track expenses, set goals, and stay on top of your finances effortlessly
                </p>
                <div className="flex justify-center gap-4">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
                        Get Started
                    </button>
                    <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg hover:bg-gray-300 transition">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;