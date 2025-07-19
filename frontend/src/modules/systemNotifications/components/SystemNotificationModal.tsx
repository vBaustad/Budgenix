// src/systemNotifications/components/SystemNotificationModal.tsx

import { useSystemNotificationContext } from '../context/SystemNotificationContext';
import { useTranslation } from 'react-i18next';

export const SystemNotificationModal = () => {
  const {
    currentNotification,
    currentIndex,
    notifications,
    next,
    markCurrentAsRead,
    dismissAll,
  } = useSystemNotificationContext();

  const { t } = useTranslation();

  if (!currentNotification) return null;

  const hasNext = currentIndex < notifications.length - 1;

  const handleNext = async () => {
    await markCurrentAsRead();
    next();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-base-100 shadow-xl p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">
          {t(currentNotification.titleKey ?? '', {
            defaultValue: currentNotification.title ?? 'Untitled',
          })}
        </h2>

        <p className="mb-4 whitespace-pre-line">
          {t(currentNotification.messageKey ?? '', {
            defaultValue: currentNotification.message ?? '',
          })}
        </p>

        <div className="flex justify-between items-center">
          {hasNext ? (
            <button className="btn btn-primary" onClick={handleNext}>
              {t('buttons.next')}
            </button>
          ) : (
            <button className="btn btn-success" onClick={dismissAll}>
              {t('buttons.dismiss')}
            </button>
          )}
          <span className="text-sm text-muted">
            {t('systemNotifications.counter', {
              current: currentIndex + 1,
              total: notifications.length,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
