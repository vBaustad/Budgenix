import { useState } from 'react';
import AddBudgetModal from './AddBudgetModal';
import { AppIcons } from '@/components/icons/AppIcons';

export default function AddBudgetButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary fixed bottom-6 right-6 shadow-lg"
      >
        <AppIcons.add className="w-4 h-4 mr-2" />
        Add Budget
      </button>

      {open && <AddBudgetModal onClose={() => setOpen(false)} />}
    </>
  );
}
