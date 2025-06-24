'use client'

import { useTranslation } from 'react-i18next';
import { AppIcons } from '@/components/icons/AppIcons';

export default function SignupConfirmationPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-100 p-8">
      <div className="card shadow-lg bg-base-200 p-8 max-w-md text-center">
        <AppIcons.complete className="w-16 h-16 text-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('signup.confirmationTitle', 'Check your email!')}</h1>
        <p className="text-base-content/70 mb-4">
          {t('signup.confirmationMessage', 'We’ve sent a confirmation email. Please check your inbox and confirm your email to activate your account.')}
        </p>
        <a href="/" className="btn btn-primary mt-4">
          {t('signup.backToHome', 'Back to Home')}
        </a>
      </div>
    </div>
  );
}
