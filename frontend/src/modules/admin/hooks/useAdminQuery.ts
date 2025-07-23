// hooks/useAdminQuery.ts

import { useQuery } from '@tanstack/react-query';
import {
  fetchAdminUsers,
  fetchUserDetails,
  fetchAuditLogsForUser,
  fetchManualOverrides,
} from '../services/adminService';
import {
  AdminUserDto,
  AdminUserDetailsDto,
  ManualSubscriptionOverrideDto,
} from '@/modules/admin/types/admin';
import { AuditLogDto } from '@/modules/admin/types/auditLogDto';

export const useAdminUsers = () =>
  useQuery<AdminUserDto[]>({
    queryKey: ['admin', 'users'],
    queryFn: fetchAdminUsers,
    staleTime: 5 * 60 * 1000,
  });

export const useAdminUserDetails = (userId: string) =>
  useQuery<AdminUserDetailsDto>({
    queryKey: ['admin', 'user', userId],
    queryFn: () => fetchUserDetails(userId),
    enabled: !!userId,
  });

export const useAuditLogsForUser = (userId: string) =>
  useQuery<AuditLogDto[]>({
    queryKey: ['admin', 'logs', userId],
    queryFn: () => fetchAuditLogsForUser(userId),
    enabled: !!userId,
  });

export const useManualOverrides = (userId: string) =>
  useQuery<ManualSubscriptionOverrideDto[]>({
    queryKey: ['admin', 'overrides', userId],
    queryFn: () => fetchManualOverrides(userId),
    enabled: !!userId,
  });
