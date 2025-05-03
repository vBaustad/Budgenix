import React from 'react';
import HeroSection from '../../components/public/HeroSection';
import PricingSection from '../../components/public/PricingSection';
import AboutSection from '../../components/public/AboutSection';


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