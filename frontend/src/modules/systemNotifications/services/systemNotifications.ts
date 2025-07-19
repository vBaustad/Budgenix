// src/systemNotifications/services/systemNotifications.ts

import { apiFetch } from '@/utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { SystemNotification } from '../types/systemNotifications';

// === RAW FETCHERS ===
async function fetchUnreadSystemNotifications(): Promise<SystemNotification[]> {
  console.log('[SystemNotifications] Fetching unread notifications...');
  const result = await apiFetch<SystemNotification[]>('/api/systemnotifications/unread');
  if (!result) {
    console.error('[SystemNotifications] Failed to fetch notifications');
    throw new Error('Failed to fetch system notifications');
  }
  console.log('[SystemNotifications] Fetched unread notifications:', result);
  return result;
}

async function markSystemNotificationAsRead(id: string): Promise<void> {
  console.log(`[SystemNotifications] Marking notification ${id} as read...`);
  await apiFetch(`/api/systemnotifications/mark-read/${id}`, {
    method: 'POST',
  });
  console.log(`[SystemNotifications] Notification ${id} marked as read.`);
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
    onSuccess: (_, id) => {
      console.log(`[SystemNotifications] Invalidating cache after marking ${id} as read`);
      queryClient.invalidateQueries({ queryKey: ['systemNotifications', 'unread'] });
    },
    onError: (err) => {
      console.error('[SystemNotifications] Failed to mark as read:', err);
    },
  });
}
