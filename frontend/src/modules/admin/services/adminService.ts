// services/adminService.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import {
  AdminUserDto,
  AdminUserDetailsDto,
  AdminDeleteResultDto,
  ManualSubscriptionOverrideDto,
  GrantSubscriptionOverrideDto,
} from '@/modules/admin/types/admin';
import { AuditLogDto } from '@/modules/admin/types/auditLogDto';

// === API Base URL ===
const API_URL = '/api/admin';

// === Query Keys ===
export const AdminQueryKeys = {
  users: ['admin', 'users'] as const,
  user: (id: string) => ['admin', 'user', id] as const,
  auditLogs: (id: string) => ['admin', 'logs', id] as const,
  manualOverrides: (id: string) => ['admin', 'overrides', id] as const,
};

// === Pure API Fetch Functions ===

export async function fetchAdminUsers(): Promise<AdminUserDto[]> {
  const result = await apiFetch<AdminUserDto[]>(`${API_URL}/users`);
  if (!result) throw new Error('Failed to fetch admin users');
  return result;
}

export async function fetchUserDetails(userId: string): Promise<AdminUserDetailsDto> {
  const result = await apiFetch<AdminUserDetailsDto>(`${API_URL}/user/${userId}`);
  if (!result) throw new Error('Failed to fetch user details');
  return result;
}

export async function fetchAuditLogsForUser(userId: string): Promise<AuditLogDto[]> {
  const result = await apiFetch<AuditLogDto[]>(`${API_URL}/user/${userId}/logs`);
  if (!result) throw new Error('Failed to fetch audit logs');
  return result;
}

export async function fetchManualOverrides(userId: string): Promise<ManualSubscriptionOverrideDto[]> {
  const result = await apiFetch<ManualSubscriptionOverrideDto[]>(`${API_URL}/user/${userId}/overrides`);
  if (!result) throw new Error('Failed to fetch manual subscription overrides');
  return result;
}

export async function deleteUser(userId: string): Promise<AdminDeleteResultDto> {
  const result = await apiFetch<AdminDeleteResultDto>(`${API_URL}/user/${userId}`, {
    method: 'DELETE',
  });
  if (!result) throw new Error('Failed to delete user');
  return result;
}

export async function deleteUserItem(userId: string, itemType: string, itemId: string): Promise<void> {
  await apiFetch(`${API_URL}/user/${userId}/${itemType}/${itemId}`, {
    method: 'DELETE',
  });
}

export async function grantManualSubscriptionOverride(data: GrantSubscriptionOverrideDto): Promise<void> {
  await apiFetch(`${API_URL}/user/${data.userId}/grant-subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function revokeManualSubscriptionOverride(
  overrideId: string,
  userId: string,
  customMessage?: string
): Promise<void> {
  await apiFetch(`/api/admin/user/${userId}/revoke-override/${overrideId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customMessage }),
  });
}


// === Mutation Hooks ===

export function useGrantManualSubscriptionOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: grantManualSubscriptionOverride,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: AdminQueryKeys.manualOverrides(variables.userId) });
      queryClient.invalidateQueries({ queryKey: AdminQueryKeys.user(variables.userId) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AdminQueryKeys.users });
    },
  });
}

export function useDeleteUserItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { userId: string; itemType: string; itemId: string }) =>
      deleteUserItem(params.userId, params.itemType, params.itemId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: AdminQueryKeys.user(variables.userId) });
    },
  });
}

export function useRevokeManualSubscriptionOverride() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { overrideId: string; userId: string; customMessage?: string }) =>
      revokeManualSubscriptionOverride(data.overrideId, data.userId, data.customMessage),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: AdminQueryKeys.manualOverrides(variables.userId) });
      queryClient.invalidateQueries({ queryKey: AdminQueryKeys.user(variables.userId) });
    },
  });
}

