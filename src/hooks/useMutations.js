import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URLS } from '../../utils/apiConfig';
import { api, adminApi, getAdminToken, getToken } from '../lib/apiClient';
import { queryKeys } from '../lib/queryKeys';
import { DEFAULT_AVATAR } from '../lib/constants';

/* ------------------------------------------------------------------ *
 * Auth
 * ------------------------------------------------------------------ */

export const useUserLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password, deviceInfo, sessionId }) => {
      const { data } = await api.post(
        API_URLS.userlogin,
        { password, deviceInfo, sessionId },
        { skipAuth: true, skipAuthRedirect: true },
      );
      return data;
    },
    onSuccess: (data) => {
      const { token, user } = data;
      const profilePicture = user?.profilePicture || DEFAULT_AVATAR;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ ...user, profilePicture }));

      if (user?.sessionId) {
        localStorage.setItem('sessionId', user.sessionId);
      } else {
        localStorage.removeItem('sessionId');
      }

      // Drop anything cached from a previous session
      queryClient.clear();
    },
  });
};

export const useAdminLogin = () =>
  useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post(
        API_URLS.adminlogin,
        { email, password },
        { skipAuth: true, skipAuthRedirect: true },
      );
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('adminToken', data.token);
    },
  });

export const useCreateUser = () =>
  useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post(API_URLS.createuser, formData, {
        skipAuth: true,
        skipAuthRedirect: true,
      });
      return data;
    },
  });

/* ------------------------------------------------------------------ *
 * Wallet
 * ------------------------------------------------------------------ */

export const useAddMoney = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, accountNumber, bankCode, bankName }) => {
      const { data } = await api.post(API_URLS.addmoney, {
        amount: Number(amount),
        accountNumber,
        bankCode,
        bankName,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.balance });
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData) => {
      const { data } = await api.post(API_URLS.transactions, transactionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['last-transactions'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.balance });
      queryClient.invalidateQueries({ queryKey: ['money-out'] });
    },
  });
};

export const useUpdateBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount) => {
      const { data } = await api.post(API_URLS.updatebalance, { amount });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.balance });
    },
  });
};

export const useUpdateMoneyOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, amount }) => {
      const { data } = await api.post(API_URLS.updatemoneyout, { userId, amount });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['money-out'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.balance });
    },
  });
};

export const useReverseTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId) => {
      const { data } = await api.put(API_URLS.reverseTransaction(transactionId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['last-transactions'] });
    },
  });
};

/* ------------------------------------------------------------------ *
 * Beneficiaries (saved recipients)
 * ------------------------------------------------------------------ */

export const useSaveBeneficiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, accountDetails }) => {
      const { data } = await api.post(API_URLS.saveRecentTransaction, { userId, accountDetails });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
      queryClient.invalidateQueries({ queryKey: ['beneficiary-search'] });
    },
  });
};

export const useDeleteBeneficiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId) => {
      const { data } = await api.delete(API_URLS.deleterecenttransaction(transactionId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
      queryClient.invalidateQueries({ queryKey: ['beneficiary-search'] });
    },
  });
};

export const useValidateAccount = () =>
  useMutation({
    mutationFn: async ({ accountNumber, bankCode }) => {
      const { data } = await api.post(API_URLS.useraccount, {
        AccountNumber: accountNumber,
        Bankcode: bankCode,
      });
      return data;
    },
  });

/* ------------------------------------------------------------------ *
 * Account
 * ------------------------------------------------------------------ */

export const useChangePassword = () =>
  useMutation({
    mutationFn: async ({ oldPassword, newPassword }) => {
      const { data } = await api.post(API_URLS.changepassword, {
        token: getToken(),
        OldPassword: oldPassword,
        NewPassword: newPassword,
      });
      return data;
    },
  });

export const useChangeAdminPassword = () =>
  useMutation({
    mutationFn: async ({ oldPassword, newPassword }) => {
      const { data } = await api.post(API_URLS.changeadminpassword, {
        adminToken: getAdminToken(),
        OldPassword: oldPassword,
        NewPassword: newPassword,
      });
      return data;
    },
  });

export const useUploadPicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, file }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', userId);

      const { data } = await api.post(API_URLS.uploadpicture, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (data) => {
      // Keep the cached avatar in sync with the stored user object
      try {
        const stored = JSON.parse(localStorage.getItem('user') || 'null');
        if (stored && data?.url) {
          localStorage.setItem('user', JSON.stringify({ ...stored, profilePicture: data.url }));
        }
      } catch {
        // ignore malformed storage
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.balance });
    },
  });
};

export const useFundAccount = () =>
  useMutation({
    mutationFn: async ({ username, amount }) => {
      const { data } = await api.post(API_URLS.fundaccount, { username, amount: parseInt(amount, 10) });
      return data;
    },
  });

export const useCheckTransactionLimit = () =>
  useMutation({
    mutationFn: async () => {
      const { data } = await api.post(API_URLS.checkTransactionLimit, { token: getToken() });
      return data;
    },
  });

/* ------------------------------------------------------------------ *
 * Admin
 * ------------------------------------------------------------------ */

export const useDeleteUserTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId }) => {
      const { data } = await adminApi.delete(API_URLS.deleteuserTransaction(transactionId));
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.root });
      if (variables?.userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.userTransactions(variables.userId) });
      }
    },
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await adminApi.put(API_URLS.blockUser(userId), { blocked: true });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await adminApi.put(API_URLS.unblockUser(userId), { blocked: false });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });
};

export const useSetUnlimited = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, unlimited }) => {
      const { data } = await adminApi.post(API_URLS.setUnlimited, { userId, unlimited });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });
};

export const useLogoutSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId) => {
      const { data } = await adminApi.delete(API_URLS.logoutsession(sessionId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.sessions });
    },
  });
};

export const useDeleteFunding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await adminApi.delete(`${API_URLS.delectfunding}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.funding });
    },
  });
};

export const useChangeTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, status }) => {
      const { data } = await api.put(API_URLS.changetransactions(transactionId), { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['last-transactions'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.root });
    },
  });
};
