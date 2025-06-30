import { useAdminUsers } from './hooks/useAdminUsers';
import { AdminUserDto } from '@/admin/types/admin';

const AdminPage = () => {
  const { data: users, isLoading, isError } = useAdminUsers();

  if (isLoading) return <p className="p-6">Loading users...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load users.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <table className="w-full table-auto border border-base-300">
        <thead>
          <tr className="bg-base-200">
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Signup</th>
            <th className="text-left p-2">Last Active</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: AdminUserDto) => (
            <tr key={user.id} className="border-t border-base-300">
              <td className="p-2">{user.email}</td>
              <td className="p-2">{new Date(user.signupDate).toLocaleDateString()}</td>
              <td className="p-2">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}</td>
              <td className="p-2">
                <button className="btn btn-xs btn-error">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
