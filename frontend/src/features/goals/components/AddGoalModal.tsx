'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useCreateGoal } from '../services/GoalsService';
import toast from 'react-hot-toast';
import InputField from '@/components/common/forms/InputField';
import SelectField from '@/components/common/forms/SelectField';
import { AppIcons } from '@/components/icons/AppIcons';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
};

export default function AddGoalModal({ onClose }: Props) {
  const { t } = useTranslation();
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
      toast.error(t('goals.toast.invalidForm'));
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
          toast.success(t('goals.toast.createSuccess'));
          onClose();
        },
        onError: () => toast.error(t('goals.toast.createError')),
      }
    );
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" />
      <Dialog.Panel className="bg-base-100 rounded-xl p-6 shadow-lg max-w-md w-full z-50">
        <Dialog.Title className="text-lg font-bold mb-4">
          {t('goals.addGoal.title')}
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
            {t('shared.save')}
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
