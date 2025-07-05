import { Dialog } from '@headlessui/react';

type ConfirmDeleteDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="relative bg-base-100 rounded-lg p-6 shadow-lg z-50 w-full max-w-sm">
        <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
        <Dialog.Description className="mt-2">{description}</Dialog.Description>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="btn btn-ghost">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
