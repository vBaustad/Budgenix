export interface SystemNotification {
  id: string;
  titleKey?: string;     // Optional — used for i18n
  messageKey?: string;   // Optional — used for i18n
  title?: string;        // Optional fallback
  message?: string;      // Optional fallback
  tag: 'major' | 'minor' | 'info' | 'hotfix' | string;
  createdAt: string;
}
