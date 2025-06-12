import React from 'react';
import AboutSection from '@/features/public/components/AboutSection';
import PricingSection from '@/features/public/components/PricingSection';
import HeroSection from '@/features/public/components/HeroSection';

const LandingPage: React.FC = () => {
    return (
        <div>
            <HeroSection />
            <AboutSection />
            <PricingSection />
        </div>
    );
};

export default LandingPage;