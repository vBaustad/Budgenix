import { useEffect } from 'react';
import { AuditLogDto } from '@/admin/types/auditLogDto';
import { AdminUserDetailsDto } from '@/admin/types/admin';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  user: AdminUserDetailsDto | null;
  auditLogs: AuditLogDto[];
  onClose: () => void;
}

const UserDetailsModal = ({ user, auditLogs, onClose }: Props) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-100 shadow-lg rounded-lg w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-2 right-2 text-lg btn btn-sm"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">User Details: {user.email}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Signup:</strong> {new Date(user.signupDate).toLocaleDateString()}</p>
            <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}</p>
            <p><strong>Subscription:</strong> {user.subscriptionTier}</p>
            <p><strong>Expenses:</strong> {user.stats?.expenses ?? '—'}</p>
            <p><strong>Income:</strong> {user.stats?.income ?? '—'}</p>
            <p><strong>Budgets:</strong> {user.stats?.budgets ?? '—'}</p>
            <p><strong>Goals:</strong> {user.stats?.goals ?? '—'}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <ul className="max-h-60 overflow-y-auto border rounded p-2 text-sm">
              {auditLogs.length === 0 && <li>No logs found.</li>}
              {auditLogs.map((log) => (
                <li key={log.id} className="mb-2 border-b pb-2">
                  <div className="font-medium">{log.action}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(log.timestamp))} ago
                  </div>
                  {log.entityType && (
                    <div className="text-xs">Entity: {log.entityType}</div>
                  )}
                  {log.entityId && (
                    <div className="text-xs">ID: {log.entityId}</div>
                  )}
                  {log.success === false && log.errorMessage && (
                    <div className="text-red-500 text-xs">Error: {log.errorMessage}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-right">
          <button className="btn btn-sm btn-neutral" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
