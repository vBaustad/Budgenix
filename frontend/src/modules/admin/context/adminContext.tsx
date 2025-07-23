import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  ReactNode,
} from 'react';

import {
  useAdminUsers,
  useAdminUserDetails,
  useAuditLogsForUser,
} from '../hooks/useAdminQuery';

import { 
    useDeleteUser, 
    useDeleteUserItem, 
    useGrantManualSubscriptionOverride, 
    useRevokeManualSubscriptionOverride
} from '../services/adminService';

import {
  AdminUserDto,
  AdminUserDetailsDto,
  GrantSubscriptionOverrideDto,
} from '@/modules/admin/types/admin';
import { AuditLogDto } from '@/modules/admin/types/auditLogDto';


type AdminContextType = {
  adminUsers: AdminUserDto[];
  selectedUserDetails: AdminUserDetailsDto | null;
  auditLogs: AuditLogDto[];
  loading: boolean;
  selectUser: (userId: string) => Promise<void>;
  closeUserModal: () => void;
  grantOverride: (dto: GrantSubscriptionOverrideDto) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  deleteUserItem: (userId: string, itemType: string, itemId: string) => Promise<void>;
  revokeOverride: (overrideId: string, userId: string, customMessage?: string) => Promise<void>;

};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { data: users = [], isLoading: isUsersLoading } = useAdminUsers();    
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const {
    data: userDetails,
    isLoading: isDetailsLoading,
  } = useAdminUserDetails(selectedUserId ?? '');

  const {
    data: logs = [],
    isLoading: isLogsLoading,
  } = useAuditLogsForUser(selectedUserId ?? '');

  const grantMutation = useGrantManualSubscriptionOverride();
  const deleteUserMutation = useDeleteUser();
  const deleteUserItemMutation = useDeleteUserItem();
  const revokeMutation = useRevokeManualSubscriptionOverride();
  
  const selectUser = useCallback(async (id: string) => {
    setSelectedUserId(id);
  }, []);

  const closeUserModal = useCallback(() => {
    setSelectedUserId(null);
  }, []);

  const grantOverride = useCallback(
    async (dto: GrantSubscriptionOverrideDto) => {
      await grantMutation.mutateAsync(dto);
    },
    [grantMutation]
  );

  const revokeOverride = useCallback(
    async (overrideId: string, userId: string, customMessage?: string) => {
        await revokeMutation.mutateAsync({ overrideId, userId, customMessage });
    },
    [revokeMutation]
    );

  const deleteUser = useCallback(
    async (userId: string) => {
      await deleteUserMutation.mutateAsync(userId);
    },
    [deleteUserMutation]
  );

  const deleteUserItem = useCallback(
    async (userId: string, itemType: string, itemId: string) => {
      await deleteUserItemMutation.mutateAsync({ userId, itemType, itemId });
    },
    [deleteUserItemMutation]
  );

  const value = useMemo<AdminContextType>(
    () => ({
      adminUsers: users,
      selectedUserDetails: userDetails ?? null,
      auditLogs: logs,
      loading: isUsersLoading || isDetailsLoading || isLogsLoading,
      selectUser,
      closeUserModal,
      grantOverride,
      revokeOverride,
      deleteUser,
      deleteUserItem,
    }),
    [
      users,
      userDetails,
      logs,
      isUsersLoading,
      isDetailsLoading,
      isLogsLoading,
      selectUser,
      closeUserModal,
      grantOverride,
      revokeOverride,
      deleteUser,
      deleteUserItem,
    ]
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}
