import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useCreateGoal } from '../services/GoalsService';
import toast from 'react-hot-toast';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';
import { AppIcons } from '@/components/icons/AppIcons';

type Props = {
  onClose: () => void;
};

export default function AddGoalModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>('');
  const [icon, setIcon] = useState<string>('');
  const { mutate: createGoal } = useCreateGoal();

  const iconOptions = Object.keys(AppIcons).map((key) => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  const handleSubmit = () => {
    if (!name.trim() || !targetAmount || Number(targetAmount) <= 0) {
      toast.error('Please fill out all required fields correctly.');
      return;
    }

    createGoal(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        targetAmount: Number(targetAmount),
        currentAmount: 0,
        targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
        icon: icon || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Goal created');
          onClose();
        },
        onError: () => toast.error('Failed to create goal'),
      }
    );
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" />
      <Dialog.Panel className="bg-base-100 rounded-xl p-6 shadow-lg max-w-md w-full z-50">
        <Dialog.Title className="text-lg font-bold mb-4">Add New Goal</Dialog.Title>
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
            Save
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
