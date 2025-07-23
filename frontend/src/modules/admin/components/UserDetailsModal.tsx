import { useEffect, useState } from 'react';
import { AuditLogDto } from '@/modules/admin/types/auditLogDto';
import { AdminUserDetailsDto } from '@/modules/admin/types/admin';
import { formatDistanceToNow } from 'date-fns';
import { AppIcons } from '@/components/icons/AppIcons';
import { useTranslation } from 'react-i18next';
import { useGrantManualSubscriptionOverride, useRevokeManualSubscriptionOverride } from '../services/adminService';
import { toast } from 'react-hot-toast';

interface Props {
  user: AdminUserDetailsDto | null;
  auditLogs: AuditLogDto[];
  loading: boolean;
  onClose: () => void;
}

const UserDetailsModal = ({ user, auditLogs, loading, onClose }: Props) => {
  const { t } = useTranslation();
  const [selectedTier, setSelectedTier] = useState<'Hobby' | 'Pro'>('Pro');
  const [endDate, setEndDate] = useState('');
  const [granting, setGranting] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  const { mutateAsync: grantManualSubscription } = useGrantManualSubscriptionOverride();
  const { mutateAsync: revokeManualSubscription } = useRevokeManualSubscriptionOverride();
  const handleGrantOverride = async () => {
    if (!user || !endDate) return;

    try {
      setGranting(true);
      await grantManualSubscription({
        userId: user.id,
        tier: selectedTier,
        startDate: new Date().toISOString(),
        endDate: new Date(endDate).toISOString(),
        customMessage: customMessage.trim() || undefined,
        sendEmail,
      });

      toast.success(t('admin.userDetails.overrideGranted'));
    } catch (err) {
      console.error('Error granting subscription override', err);
      toast.error(t('admin.userDetails.overrideError'));
    } finally {
      setGranting(false);
    }
  };

  useEffect(() => {
    console.log('[UserDetailsModal] Loaded user:', user);
    console.log('[UserDetailsModal] manualOverrides:', user?.manualOverrides);

    const sorted = [...(user?.manualOverrides ?? [])]
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

    console.log('[UserDetailsModal] Sorted overrides:', sorted);
    console.log('[UserDetailsModal] Latest override:', sorted[0]);
  }, [user]);


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

  const latestOverride = [...(user.manualOverrides ?? [])]
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];

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
                value={
                  user.emailConfirmed ? (
                    <AppIcons.check className="w-4 h-4 text-success" />
                  ) : (
                    <AppIcons.x className="w-4 h-4 text-error" />
                  )
                }
              />
              <InfoItem icon={AppIcons.secure} label={t('admin.userDetails.role')} value={user.role} />
              <InfoItem icon={AppIcons.globe} label={t('shared.country')} value={user.country ?? '—'} />
              <InfoItem icon={AppIcons.calendar} label={t('admin.userDetails.signup')} value={new Date(user.signupDate).toLocaleDateString()} />
              <InfoItem icon={AppIcons.upcoming} label={t('admin.userDetails.lastLogin')} value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'} />
            </Section>

            <Section title={t('admin.userDetails.subscription')}>
              <InfoItem
                icon={AppIcons.wallet}
                label={t('settings.profile.fields.tier')}
                value={
                  latestOverride ? (
                    <span>
                      <span className="font-semibold">{latestOverride.tier}</span>{' '}
                      <span className="text-xs text-base-content/70">
                        ({t('admin.userDetails.overridden')} – {new Date(latestOverride.endDate).toLocaleDateString()})
                      </span>
                    </span>
                  ) : (
                    user.subscriptionTier
                  )
                }
              />
              <InfoItem
                icon={AppIcons.lock}
                label={t('admin.userDetails.active')}
                value={user.subscriptionIsActive ? (
                    <AppIcons.check className="w-4 h-4 text-success" />
                  ) : (
                    <AppIcons.x className="w-4 h-4 text-error" />
                  )
                }                
              />
              <InfoItem icon={AppIcons.calendar} label={t('settings.profile.fields.billingCycle')} value={user.billingCycle} />
              <InfoItem icon={AppIcons.arrowUp} label={t('admin.userDetails.start')} value={user.subscriptionStartDate ? new Date(user.subscriptionStartDate).toLocaleDateString() : '—'} />
              <InfoItem icon={AppIcons.arrowDown} label={t('admin.userDetails.end')} value={user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : '—'} />
              <InfoItem icon={AppIcons.assets} label={t('settings.app.currency')} value={user.preferredCurrency ?? '—'} />
              <InfoItem icon={AppIcons.tag} label={t('admin.userDetails.referral')} value={user.referralCode ?? '—'} />
            </Section>

            <Section title={t('admin.userDetails.grantOverride')}>
              {latestOverride && (
                <div className="flex items-center gap-2 text-info text-sm mb-2">
                  <AppIcons.warning className="w-4 h-4" />
                  <span className="font-medium">
                    {t('admin.userDetails.activeOverride')}: {new Date(latestOverride.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-2">
                <div className="flex flex-col md:flex-row gap-3">
                  <select
                    className="select select-bordered w-full md:w-40"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value as 'Hobby' | 'Pro')}
                  >
                    <option value="Hobby">Hobby</option>
                    <option value="Pro">Pro</option>
                  </select>

                  <input
                    type="date"
                    className="input input-bordered w-full md:w-48"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={2}
                  placeholder={t('admin.userDetails.messagePlaceholder')}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                  />
                  <span>{t('admin.userDetails.sendEmail')}</span>
                </label>

                <div className="flex gap-2 mt-2">
                  <button
                    className="btn btn-sm btn-success"
                    disabled={granting}
                    onClick={handleGrantOverride}
                  >
                    {granting ? t('buttons.saving') : t('admin.userDetails.grant')}
                  </button>

                  {latestOverride && (
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={async () => {
                        const confirmed = confirm(t('admin.userDetails.confirmRevoke'));
                        if (!confirmed || !user) return;

                        try {
                          await revokeManualSubscription({
                            overrideId: latestOverride.id,
                            userId: user.id,
                            customMessage: t('admin.userDetails.revokedByAdmin'),
                          });
                          toast.success(t('admin.userDetails.overrideRevoked'));
                        } catch (err) {
                          console.error('Error revoking override', err);
                          toast.error(t('admin.userDetails.overrideError'));
                        }
                      }}
                    >
                      {t('admin.userDetails.revoke')}
                    </button>
                  )}
                </div>
              </div>
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
