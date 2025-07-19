import { useEffect } from 'react';
import { AuditLogDto } from '@/modules/admin/types/auditLogDto';
import { AdminUserDetailsDto } from '@/modules/admin/types/admin';
import { formatDistanceToNow } from 'date-fns';
import { AppIcons } from '@/components/icons/AppIcons';
import { useTranslation } from 'react-i18next';

interface Props {
  user: AdminUserDetailsDto | null;
  auditLogs: AuditLogDto[];
  loading: boolean;
  onClose: () => void;
}

const UserDetailsModal = ({ user, auditLogs, loading, onClose }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-base-100 shadow-lg rounded-lg p-6 text-center">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-4">{t('admin.userDetails.loading')}</p>
        </div>
      </div>
    );
  }

  const InfoItem = ({
    icon: Icon,
    label,
    value,
    bold = false,
    color,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number | React.ReactNode;
    bold?: boolean;
    color?: string;
  }) => (
    <div className="flex items-center gap-2 text-sm">
      <Icon className={`w-4 h-4 shrink-0 ${color || 'text-base-content'}`} />
      <span className="whitespace-nowrap font-medium">{label}:</span>
      <span className={bold ? 'font-semibold' : ''}>{value}</span>
    </div>
  );

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 border-b border-base-300 pb-1">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-100 shadow-lg rounded-lg w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AppIcons.user className="w-5 h-5" />
          {t('admin.userDetails.title')}: {user.email}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Section title={t('admin.userDetails.profile')}>
              <InfoItem icon={AppIcons.user} label={t('shared.name')} value={user.userName ?? '—'} />
              <InfoItem icon={AppIcons.mail} label={t('shared.email')} value={user.email} />
              <InfoItem
                icon={AppIcons.secure}
                label={t('admin.userDetails.emailConfirmed')}
                value={user.emailConfirmed ? '✔️' : '❌'}
                color={user.emailConfirmed ? 'text-success' : 'text-error'}
              />
              <InfoItem icon={AppIcons.secure} label={t('admin.userDetails.role')} value={user.role} />
              <InfoItem icon={AppIcons.globe} label={t('shared.country')} value={user.country ?? '—'} />
              <InfoItem icon={AppIcons.calendar} label={t('admin.userDetails.signup')} value={new Date(user.signupDate).toLocaleDateString()} />
              <InfoItem icon={AppIcons.upcoming} label={t('admin.userDetails.lastLogin')} value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'} />
            </Section>

            <Section title={t('admin.userDetails.subscription')}>
              <InfoItem icon={AppIcons.wallet} label={t('settings.profile.fields.tier')} value={user.subscriptionTier} />
              <InfoItem
                icon={AppIcons.lock}
                label={t('admin.userDetails.active')}
                value={user.subscriptionIsActive ? '✔️' : '❌'}
                color={user.subscriptionIsActive ? 'text-success' : 'text-error'}
              />
              <InfoItem icon={AppIcons.calendar} label={t('settings.profile.fields.billingCycle')} value={user.billingCycle} />
              <InfoItem icon={AppIcons.arrowUp} label={t('admin.userDetails.start')} value={user.subscriptionStartDate ? new Date(user.subscriptionStartDate).toLocaleDateString() : '—'} />
              <InfoItem icon={AppIcons.arrowDown} label={t('admin.userDetails.end')} value={user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : '—'} />
              <InfoItem icon={AppIcons.assets} label={t('settings.app.currency')} value={user.preferredCurrency ?? '—'} />
              <InfoItem icon={AppIcons.tag} label={t('admin.userDetails.referral')} value={user.referralCode ?? '—'} />
            </Section>

            <Section title={t('admin.userDetails.usage')}>
              <InfoItem icon={AppIcons.expenses} label={t('sidebar.expenses')} value={user.stats?.expenses ?? 0} />
              <InfoItem icon={AppIcons.income} label={t('sidebar.income')} value={user.stats?.income ?? 0} />
              <InfoItem icon={AppIcons.report} label={t('sidebar.budgets')} value={user.stats?.budgets ?? 0} />
              <InfoItem icon={AppIcons.goal} label={t('sidebar.goals')} value={user.stats?.goals ?? 0} />
            </Section>
          </div>

          <div>
            <Section title={t('admin.userDetails.recent')}>
              {auditLogs.length === 0 ? (
                <p className="text-sm text-base-content/70 italic">{t('admin.userDetails.noLogs')}</p>
              ) : (
                <ul className="max-h-96 overflow-y-auto text-sm divide-y divide-base-300 border rounded">
                  {auditLogs.map((log) => (
                    <li key={log.id} className="p-3 space-y-1">
                      <div className="font-medium text-base-content">{log.action}</div>
                      <div className="text-xs text-base-content/70">
                        {formatDistanceToNow(new Date(log.timestamp))} {t('shared.ago')}
                      </div>
                      {log.entityType && <div className="text-xs">{t('admin.userDetails.entity')}: {log.entityType}</div>}
                      {log.entityId && <div className="text-xs">{t('admin.userDetails.id')}: {log.entityId}</div>}
                      {!log.success && log.errorMessage && (
                        <div className="text-xs text-error">{t('admin.userDetails.error')}: {log.errorMessage}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </div>
        </div>

        <div className="text-right mt-4">
          <button className="btn btn-sm btn-neutral" onClick={onClose}>
            {t('buttons.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
