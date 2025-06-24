import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useContributeGoal } from '../services/GoalsService';
import { GoalDto } from '@/types/finance/goal';
import InputField from '@/components/common/forms/InputField';
import toast from 'react-hot-toast';

type Props = {
  goal: GoalDto;
  onClose: () => void;
};

export default function AddGoalContributionModal({ goal, onClose }: Props) {
  const [amount, setAmount] = useState<string>('');
  const { mutate: contributeGoal } = useContributeGoal();

  const handleSubmit = () => {
    if (!amount.trim() || Number(amount) <= 0) {
      toast.error('Please enter a valid contribution amount.');
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
          toast.success('Contribution added');
          onClose();
        },
        onError: () => toast.error('Failed to add contribution'),
      }
    );
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" />
      <Dialog.Panel className="bg-base-100 rounded-xl p-6 shadow-lg max-w-sm w-full z-50">
        <Dialog.Title className="text-lg font-bold mb-4">
          Add Contribution to <span className="text-primary">{goal.name}</span>
        </Dialog.Title>
        <div className="space-y-3">
          <InputField
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Contribution amount"
            required
            showCurrency
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            Add Contribution
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
