import { useState } from 'react';
import { useAdminUsers } from './hooks/useAdminQuery';
import { AdminUserDto, AdminUserDetailsDto } from '@/modules/admin/types/admin';
import { AuditLogDto } from '@/modules/admin/types/auditLogDto';
import UserDetailsModal from './components/UserDetailsModal';
import { fetchUserDetails, fetchAuditLogsForUser } from './services/adminService';

import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

const AdminPage = () => {
  const { t } = useTranslation();
  const { data: users, isLoading, isError } = useAdminUsers();

  const [selectedUserDetails, setSelectedUserDetails] = useState<AdminUserDetailsDto | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogDto[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const openUserModal = async (userId: string) => {
    setLoadingDetails(true);
    try {
      const [details, logs] = await Promise.all([
        fetchUserDetails(userId),
        fetchAuditLogsForUser(userId),
      ]);
      setSelectedUserDetails(details);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load user details or logs', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedUserDetails(null);
    setAuditLogs([]);
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

      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto border border-base-300">
          <thead>
            <tr className="bg-base-200">
              <th className="text-left p-2">{t('admin.panel.columns.email')}</th>
              <th className="text-left p-2">{t('admin.panel.columns.role')}</th>
              <th className="text-left p-2 hidden md:table-cell">{t('admin.panel.columns.tier')}</th>
              <th className="text-left p-2 hidden md:table-cell">{t('admin.panel.columns.signup')}</th>
              <th className="text-left p-2">{t('admin.panel.columns.lastActive')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user: AdminUserDto) => (
              <tr
                key={user.id}
                onClick={() => openUserModal(user.id)}
                className="border-t border-base-300 hover:bg-base-200 cursor-pointer"
              >
                <td className="p-2">{user.email.split('@')[0]}</td>
                <td className="p-2 capitalize">
                  <span className="badge badge-sm badge-info">{user.role}</span>
                </td>
                <td className="p-2 hidden md:table-cell">
                  <span className="badge badge-secondary">{user.subscriptionTier}</span>
                </td>
                <td className="p-2 hidden md:table-cell">
                  {new Date(user.signupDate).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {user.lastLogin
                    ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUserDetails && (
        <UserDetailsModal
          user={selectedUserDetails}
          auditLogs={auditLogs}
          loading={loadingDetails}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AdminPage;
