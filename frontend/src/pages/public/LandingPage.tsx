import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import AboutSection from '@/features/public/components/AboutSection';
import PricingSection from '@/features/public/components/PricingSection';
import HeroSection from '@/features/public/components/HeroSection';

const LandingPage: React.FC = () => {
  const { user, authChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && user) {
      navigate('/dashboard');
    }
  }, [authChecked, user, navigate]);

  return (
    <div>
      <HeroSection />
      <AboutSection />
      <PricingSection />
    </div>
  );
};

export default LandingPage;
