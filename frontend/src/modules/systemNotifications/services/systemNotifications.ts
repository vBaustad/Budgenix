// src/systemNotifications/services/systemNotifications.ts

import { apiFetch } from '@/utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { SystemNotification } from '../types/systemNotifications';

// === RAW FETCHERS ===
async function fetchUnreadSystemNotifications(): Promise<SystemNotification[]> {
  const result = await apiFetch<SystemNotification[]>('/api/systemnotifications/unread');
  if (!result) {
    console.error('[SystemNotifications] Failed to fetch notifications');
    throw new Error('Failed to fetch system notifications');
  }
  return result;
}

async function markSystemNotificationAsRead(id: string): Promise<void> {
  await apiFetch(`/api/systemnotifications/mark-read/${id}`, {
    method: 'POST',
  });
}

// === REACT QUERY HOOKS ===

export function useUnreadSystemNotifications() {
  const { isLoggedIn } = useAuth();

  return useQuery<SystemNotification[]>({
    queryKey: ['systemNotifications', 'unread'],
    queryFn: fetchUnreadSystemNotifications,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useMarkSystemNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markSystemNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemNotifications', 'unread'] });
    },
    onError: (err) => {
      console.error('[SystemNotifications] Failed to mark as read:', err);
    },
  });
}
