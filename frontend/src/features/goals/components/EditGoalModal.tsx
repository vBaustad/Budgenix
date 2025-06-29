'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { GoalDto } from '@/types/finance/goal';
import { useUpdateGoal } from '../services/GoalsService';
import toast from 'react-hot-toast';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';
import { AppIcons } from '@/components/icons/AppIcons';
import { useTranslation } from 'react-i18next';

type Props = {
  goal: GoalDto;
  onClose: () => void;
};

export default function EditGoalModal({ goal, onClose }: Props) {
  const { t } = useTranslation();
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
      toast.error(t('goals.toast.invalidForm'));
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
          toast.success(t('goals.toast.updateSuccess'));
          onClose();
        },
        onError: () => toast.error(t('goals.toast.updateError')),
      }
    );
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" />
      <Dialog.Panel className="bg-base-100 rounded-xl p-6 shadow-lg max-w-md w-full z-50">
        <Dialog.Title className="text-lg font-bold mb-4">
          {t('goals.editGoal.title')}
        </Dialog.Title>
        <div className="space-y-3">
          <InputField
            name="name"
            label={t('goals.addGoal.nameLabel')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('goals.addGoal.namePlaceholder')}
            required
          />
          <InputField
            name="description"
            label={t('goals.addGoal.descriptionLabel')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('goals.addGoal.descriptionPlaceholder')}
          />
          <InputField
            name="targetAmount"
            type="number"
            label={t('goals.addGoal.targetAmountLabel')}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder={t('goals.addGoal.amountPlaceholder')}
            required
            showCurrency
          />
          <InputField
            name="targetDate"
            type="date"
            label={t('goals.addGoal.targetDateLabel')}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            placeholder={t('goals.addGoal.datePlaceholder')}
          />
          <SelectField
            name="icon"
            label={t('goals.addGoal.iconLabel')}
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            options={iconOptions}
            placeholder={t('goals.addGoal.iconPlaceholder')}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn btn-ghost">
            {t('shared.cancel')}
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            {t('goals.editGoal.save')}
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
