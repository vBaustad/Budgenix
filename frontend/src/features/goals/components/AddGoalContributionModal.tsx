import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useContributeGoal } from '../services/GoalsService';
import { GoalDto } from '@/types/finance/goal';
import InputField from '@/components/common/forms/InputField';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type Props = {
  goal: GoalDto;
  onClose: () => void;
};

export default function AddGoalContributionModal({ goal, onClose }: Props) {
  const [amount, setAmount] = useState<string>('');
  const { mutate: contributeGoal } = useContributeGoal();
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (!amount.trim() || Number(amount) <= 0) {
      toast.error(t('goals.toast.invalidContribution'));
      return;
    }

    contributeGoal(
      {
        id: goal.id,
        data: {
          amount: Number(amount),
        },
      },
      {
        onSuccess: () => {
          toast.success(t('goals.toast.contributeSuccess'));
          onClose();
        },
        onError: () => toast.error(t('goals.toast.contributeError')),
      }
    );
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" />
      <Dialog.Panel className="bg-base-100 rounded-xl p-6 shadow-lg max-w-sm w-full z-50">
        <Dialog.Title className="text-lg font-bold mb-4">
          {t('goals.contribute.title', { name: goal.name })}
        </Dialog.Title>
        <div className="space-y-3">
          <InputField
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('goals.contribute.placeholder')}
            required
            showCurrency
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn btn-ghost">
            {t('goals.contribute.cancel')}
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            {t('goals.contribute.submit')}
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
