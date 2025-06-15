import { useTranslation } from 'react-i18next';

type PaymentSelectorProps = {
  selected: 'stripe' | undefined;
  onSelect: (method: 'stripe') => void;
};

export default function PaymentSelector({ selected, onSelect }: PaymentSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onSelect('stripe')}
        className={`flex-1 py-2 rounded-md text-white font-semibold transition ${
          selected === 'stripe'
            ? 'bg-[#635BFF] shadow-lg' // Stripe's purple + active style
            : 'bg-[#7F7FDA] hover:bg-[#635BFF]' // muted stripe color + hover
        }`}
      >
        💳 {t('payment.creditCard')} (Stripe)
      </button>
    </div>
  );
}
