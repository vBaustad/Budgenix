import { useQuery } from '@tanstack/react-query';
import { getAdminUsers } from '../services/adminService';
import { AdminUserDto } from '@/modules/admin/types/admin';

export const useAdminUsers = () =>
  useQuery<AdminUserDto[]>({
    queryKey: ['admin', 'users'],
    queryFn: getAdminUsers,
  });
