import { useTranslation } from 'react-i18next';

type PaymentSelectorProps = {
  selected: 'paypal' | 'stripe' | undefined;
  onSelect: (method: 'paypal' | 'stripe') => void;
};

export default function PaymentSelector({ selected, onSelect }: PaymentSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onSelect('paypal')}
        className={`btn flex-1 ${selected === 'paypal' ? 'btn-primary' : 'btn-outline'}`}
      >
        {t('payment.paypal')}
      </button>
      <button
        type="button"
        onClick={() => onSelect('stripe')}
        className={`btn flex-1 ${selected === 'stripe' ? 'btn-primary' : 'btn-outline'}`}
      >
        {t('payment.creditCard')}
      </button>
    </div>
  );
}
