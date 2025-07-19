// src/systemNotifications/context/SystemNotificationContext.tsx

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  ReactNode,
} from 'react';

import { SystemNotification } from '../types/systemNotifications';
import {
  useUnreadSystemNotifications,
  useMarkSystemNotificationAsRead,
} from '../services/systemNotifications';

type SystemNotificationContextType = {
  notifications: SystemNotification[];
  loading: boolean;
  currentIndex: number;
  currentNotification: SystemNotification | null;
  next: () => void;
  markCurrentAsRead: () => Promise<void>;
  dismissAll: () => Promise<void>;
};

const SystemNotificationContext = createContext<SystemNotificationContextType | undefined>(undefined);

export const SystemNotificationProvider = ({ children }: { children: ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useUnreadSystemNotifications();

  const { mutateAsync: markAsRead } = useMarkSystemNotificationAsRead();

  const currentNotification = notifications[currentIndex] ?? null;

  const next = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const markCurrentAsRead = useCallback(async () => {
    if (currentNotification) {
      await markAsRead(currentNotification.id);
    }
  }, [currentNotification, markAsRead]);

  const dismissAll = useCallback(async () => {
    const remaining = notifications.slice(currentIndex);
    await Promise.all(remaining.map((n) => markAsRead(n.id)));
    await refetch();
    setCurrentIndex(notifications.length); // Hide modal
  }, [notifications, currentIndex, markAsRead, refetch]);

  const value = useMemo<SystemNotificationContextType>(() => ({
    notifications,
    loading: isLoading,
    currentIndex,
    currentNotification,
    next,
    markCurrentAsRead,
    dismissAll,
  }), [
    notifications,
    isLoading,
    currentIndex,
    currentNotification,
    next,
    markCurrentAsRead,
    dismissAll,
  ]);

  return (
    <SystemNotificationContext.Provider value={value}>
      {children}
    </SystemNotificationContext.Provider>
  );
};

export const useSystemNotificationContext = (): SystemNotificationContextType => {
  const ctx = useContext(SystemNotificationContext);
  if (!ctx) throw new Error('useSystemNotificationContext must be used within a SystemNotificationProvider');
  return ctx;
};
