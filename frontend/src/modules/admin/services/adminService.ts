import { apiFetch } from '@/utils/api';
import {
  AdminUserDto,
  AdminUserDetailsDto,
  AdminDeleteResultDto,
} from '@/modules/admin/types/admin';

import { AuditLogDto } from '../types/auditLogDto';

/**
 * Fetch all users for the admin panel
 */
export const getAdminUsers = async (): Promise<AdminUserDto[]> => {
  const result = await apiFetch<AdminUserDto[]>('/api/admin/users');
  if (!result) throw new Error('Failed to fetch admin users');
  return result;
};

/**
 * Get details of a specific user
 */
export const getAdminUserDetails = async (userId: string): Promise<AdminUserDetailsDto> => {
  const result = await apiFetch<AdminUserDetailsDto>(`/api/admin/user/${userId}`);
  if (!result) throw new Error('Failed to fetch user details');
  return result;
};


export const getAuditLogsForUser = async (userId: string): Promise<AuditLogDto[]> => {
  const result = await apiFetch<AuditLogDto[]>(`/api/admin/user/${userId}/logs`);
  if (!result) throw new Error('Failed to fetch audit logs');
  return result;
};


/**
 * Delete a user and all their data
 */
export const deleteUser = async (userId: string): Promise<AdminDeleteResultDto> => {
  const result = await apiFetch<AdminDeleteResultDto>(`/api/admin/user/${userId}`, {
    method: 'DELETE',
  });
  if (!result) throw new Error('No response from deleteUser');
  return result;
};

/**
 * Delete a specific item for a user (e.g. an expense)
 */
export const deleteUserItem = async (
  userId: string,
  itemType: 'expense' | 'income' | 'budget' | 'goal',
  itemId: string
): Promise<void> => {
  const result = await apiFetch<void>(`/api/admin/user/${userId}/${itemType}/${itemId}`, {
    method: 'DELETE',
  });

  if (result !== null) {
    // Optionally warn if something was returned when it shouldn't be
    console.warn('Expected no content for deleteUserItem, but got:', result);
  }
};
