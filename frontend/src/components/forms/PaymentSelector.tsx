type PaymentSelectorProps = {
    selected: 'paypal' | 'stripe' | undefined;
    onSelect: (method: 'paypal' | 'stripe') => void;
  };
  
  export default function PaymentSelector({ selected, onSelect }: PaymentSelectorProps) {
    return (
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onSelect('paypal')}
          className={`btn flex-1 ${selected === 'paypal' ? 'btn-primary' : 'btn-outline'}`}
        >
          PayPal
        </button>
        <button
          type="button"
          onClick={() => onSelect('stripe')}
          className={`btn flex-1 ${selected === 'stripe' ? 'btn-primary' : 'btn-outline'}`}
        >
          Credit Card
        </button>
      </div>
    );
  }
  