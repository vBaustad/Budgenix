import { useState } from 'react';
import { useAdminUsers } from './hooks/useAdminUsers';
import { AdminUserDto, AdminUserDetailsDto } from '@/admin/types/admin';
import { AuditLogDto } from '@/admin/types/auditLogDto';
import UserDetailsModal from './components/UserDetailsModal';
import { getAdminUserDetails, getAuditLogsForUser } from './services/adminService';

const AdminPage = () => {
  const { data: users, isLoading, isError } = useAdminUsers();

const [selectedUser, setSelectedUser] = useState<AdminUserDto | null>(null);
const [selectedUserDetails, setSelectedUserDetails] = useState<AdminUserDetailsDto | null>(null);
const [auditLogs, setAuditLogs] = useState<AuditLogDto[]>([]);
const [loadingDetails, setLoadingDetails] = useState(false);


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


  if (isLoading) return <p className="p-6">Loading users...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load users.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <table className="w-full table-auto border border-base-300">
        <thead>
          <tr className="bg-base-200">
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Role</th>
            <th className="text-left p-2">Signup</th>
            <th className="text-left p-2">Last Active</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: AdminUserDto) => (
            <tr key={user.id} className="border-t border-base-300">
              <td className="p-2">{user.email}</td>
              <td className="p-2 capitalize">{user.role}</td>
              <td className="p-2">
                {new Date(user.signupDate).toLocaleDateString()}
              </td>
              <td className="p-2">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : '—'}
              </td>
              <td className="p-2">
                <button
                  className="btn btn-xs btn-primary mr-2"
                  onClick={() => {
                    setSelectedUser(user);
                    openUserModal(user.id);
                  }}
                >
                  View
                </button>
                <button className="btn btn-xs btn-error">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          auditLogs={auditLogs}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default AdminPage;
