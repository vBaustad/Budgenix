type Props = {
  onClose: () => void;
};

export default function AddBudgetModal({ onClose }: Props) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-base-content/30 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-base-100 p-6 rounded-xl shadow-xl w-full max-w-lg relative">
        <button className="btn btn-sm btn-circle absolute top-2 right-2" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4">Add Budget</h2>
        <p className="text-sm text-base-content/70">Form coming soon…</p>
      </div>
    </div>
  );
}
