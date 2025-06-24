import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { GoalDto } from '@/types/finance/goal';
import { useUpdateGoal } from '../services/GoalsService';
import toast from 'react-hot-toast';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';
import { AppIcons } from '@/components/icons/AppIcons';

type Props = {
  goal: GoalDto;
  onClose: () => void;
};

export default function EditGoalModal({ goal, onClose }: Props) {
  const [name, setName] = useState(goal.name);
  const [description, setDescription] = useState(goal.description || '');
  const [targetAmount, setTargetAmount] = useState<string>(goal.targetAmount.toString());
  const [targetDate, setTargetDate] = useState(goal.targetDate ? goal.targetDate.slice(0, 10) : '');
  const [icon, setIcon] = useState(goal.icon || '');
  const { mutate: updateGoal } = useUpdateGoal();

  const iconOptions = Object.keys(AppIcons).map((key) => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  const handleSubmit = () => {
    if (!name.trim() || !targetAmount || Number(targetAmount) <= 0) {
      toast.error('Please fill out all required fields correctly.');
      return;
    }

    updateGoal(
      {
        id: goal.id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          targetAmount: Number(targetAmount),
          currentAmount: goal.currentAmount,
          targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
          icon: icon || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('Goal updated');
          onClose();
        },
        onError: () => toast.error('Failed to update goal'),
      }
    );
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" />
      <Dialog.Panel className="bg-base-100 rounded-xl p-6 shadow-lg max-w-md w-full z-50">
        <Dialog.Title className="text-lg font-bold mb-4">Edit Goal</Dialog.Title>
        <div className="space-y-3">
          <InputField
            name="name"
            label="Goal Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter goal name"
            required
          />
          <InputField
            name="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional short description"
          />
          <InputField
            name="targetAmount"
            type="number"
            label="Target Amount *"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="Enter target amount"
            required
            showCurrency
          />
          <InputField
            name="targetDate"
            type="date"
            label="End Date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            placeholder="Select date"
          />
          <SelectField
            name="icon"
            label="Icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            options={iconOptions}
            placeholder="Optional icon"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
