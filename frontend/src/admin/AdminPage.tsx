import { useState } from 'react';
import { useAdminUsers } from './hooks/useAdminUsers';
import { AdminUserDto, AdminUserDetailsDto } from '@/admin/types/admin';
import { AuditLogDto } from '@/admin/types/auditLogDto';
import UserDetailsModal from './components/UserDetailsModal';
import { getAdminUserDetails, getAuditLogsForUser } from './services/adminService';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

const AdminPage = () => {
  const { t } = useTranslation();
  const { data: users, isLoading, isError } = useAdminUsers();

  const [selectedUser, setSelectedUser] = useState<AdminUserDto | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<AdminUserDetailsDto | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogDto[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const openUserModal = async (userId: string) => {
    setLoadingDetails(true);
    try {
      const [details, logs] = await Promise.all([
        getAdminUserDetails(userId),
        getAuditLogsForUser(userId),
      ]);
      setSelectedUserDetails(details);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load user details or logs', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredUsers = users?.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p className="p-6">{t('admin.panel.loading')}</p>;
  if (isError) return <p className="p-6 text-red-500">{t('admin.panel.error')}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('admin.panel.title')}</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={t('admin.panel.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-sm"
        />
      </div>

      <table className="w-full table-auto border border-base-300">
        <thead>
          <tr className="bg-base-200">
            <th className="text-left p-2">{t('admin.panel.columns.email')}</th>
            <th className="text-left p-2">{t('admin.panel.columns.role')}</th>
            <th className="text-left p-2">{t('admin.panel.columns.tier')}</th>
            <th className="text-left p-2">{t('admin.panel.columns.signup')}</th>
            <th className="text-left p-2">{t('admin.panel.columns.lastActive')}</th>
            <th className="text-left p-2">{t('admin.panel.columns.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((user: AdminUserDto) => (
            <tr
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                openUserModal(user.id);
              }}
              className="border-t border-base-300 hover:bg-base-200 cursor-pointer"
            >
              <td className="p-2">{user.email}</td>
              <td className="p-2 capitalize">
                <span className="badge badge-info">{user.role}</span>
              </td>
              <td>
                <span className="badge badge-secondary">{user.subscriptionTier}</span>
              </td>
              <td className="p-2">{new Date(user.signupDate).toLocaleDateString()}</td>
              <td className="p-2">
                {user.lastLogin
                  ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })
                  : '—'}
              </td>
              {/* <td className="p-2">
                <button className="btn btn-xs btn-error">{t('buttons.delete')}</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUserDetails}
          auditLogs={auditLogs}
          loading={loadingDetails}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default AdminPage;
