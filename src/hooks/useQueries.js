import { useQuery } from '@tanstack/react-query';
import { API_URLS } from '../../utils/apiConfig';
import { api, adminApi } from '../lib/apiClient';
import { queryKeys } from '../lib/queryKeys';

/**
 * Paginated endpoints answer with a bare array (backwards compatible) plus an
 * X-Total-Count header. This normalises both into { items, total }.
 */
const withTotal = (response) => ({
  items: response.data ?? [],
  total: Number(response.headers?.['x-total-count'] ?? response.data?.length ?? 0),
});

/* ------------------------------------------------------------------ *
 * User queries
 * ------------------------------------------------------------------ */

export const useBalance = () =>
  useQuery({
    queryKey: queryKeys.balance,
    queryFn: async () => {
      const { data } = await api.get(API_URLS.getuserbalance);
      return data?.walletBalance ?? 0;
    },
    staleTime: 30 * 1000,
  });

export const useMoneyOut = (userId) =>
  useQuery({
    queryKey: queryKeys.moneyOut(userId),
    queryFn: async () => {
      const { data } = await api.get(API_URLS.getMoneyOut(userId));
      return data?.moneyOut ?? 0;
    },
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });

export const useTransactions = (userId, { month, year, limit = 200, page = 1 } = {}) =>
  useQuery({
    queryKey: [...queryKeys.transactions(userId), { month, year, limit, page }],
    queryFn: async () => {
      const params = { limit, page };
      if (month && year) {
        params.month = month;
        params.year = year;
      }
      const response = await api.get(API_URLS.getransactions(userId), { params });
      return withTotal(response);
    },
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });

export const useLastTransactions = (userId) =>
  useQuery({
    queryKey: queryKeys.lastTransactions(userId),
    queryFn: async () => {
      const { data } = await api.get(API_URLS.getlasttwotrnasaction(userId));
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });

export const useBeneficiaries = (userId, showAll = false) =>
  useQuery({
    queryKey: queryKeys.beneficiaries(userId, showAll),
    queryFn: async () => {
      const { data } = await api.get(API_URLS.getrecentransaction(userId, showAll));
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });

export const useBeneficiarySearch = (userId) =>
  useQuery({
    queryKey: queryKeys.beneficiarySearch(userId),
    queryFn: async () => {
      const { data } = await api.get(API_URLS.getrecentransactionsearch(userId));
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });

export const useOpayRecents = (userId) =>
  useQuery({
    queryKey: queryKeys.opayRecents(userId),
    queryFn: async () => {
      const { data } = await api.get(API_URLS.getRecentTransactionsbyOpay(userId));
      return Array.isArray(data?.recents) ? data.recents : [];
    },
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });

/**
 * Polls the backend to find out whether the current session is still alive.
 * This replaces the old socket.io "sessionLoggedOut" push event.
 */
export const useSessionStatus = () =>
  useQuery({
    queryKey: queryKeys.sessionStatus,
    queryFn: async () => {
      const { data } = await api.get(API_URLS.sessionstatus);
      return data ?? { active: true };
    },
    refetchInterval: 15 * 1000,
    staleTime: 10 * 1000,
    retry: false,
  });

/* ------------------------------------------------------------------ *
 * Admin queries
 * ------------------------------------------------------------------ */

export const useAdminUsers = ({ page = 1, limit = 50 } = {}) =>
  useQuery({
    queryKey: [...queryKeys.admin.users, { page, limit }],
    queryFn: async () => {
      const response = await adminApi.get(API_URLS.getallusers, { params: { page, limit } });
      return withTotal(response);
    },
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });

export const useAdminCounts = () =>
  useQuery({
    queryKey: queryKeys.admin.counts,
    queryFn: async () => {
      const { data } = await adminApi.get(API_URLS.getCounts);
      return {
        userCount: data?.userCount ?? 0,
        transactionCount: data?.transactionCount ?? 0,
        totalCount: data?.totalCount ?? 0,
      };
    },
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });

export const useAdminTotalBalance = () =>
  useQuery({
    queryKey: queryKeys.admin.totalBalance,
    queryFn: async () => {
      const { data } = await adminApi.get(API_URLS.getTotalBalance);
      return data?.totalBalance ?? 0;
    },
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });

export const useAdminSessions = () =>
  useQuery({
    queryKey: queryKeys.admin.sessions,
    queryFn: async () => {
      const { data } = await adminApi.get(API_URLS.activesessions);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });

export const useAdminUserTransactions = (userId, { limit = 200, page = 1 } = {}) =>
  useQuery({
    queryKey: [...queryKeys.admin.userTransactions(userId), { limit, page }],
    queryFn: async () => {
      const response = await adminApi.get(API_URLS.gettransactions(userId), { params: { limit, page } });
      return withTotal(response);
    },
    enabled: Boolean(userId),
    staleTime: 15 * 1000,
  });

export const useAdminPayments = ({ page = 1, limit = 100 } = {}) =>
  useQuery({
    queryKey: [...queryKeys.admin.payments, { page, limit }],
    queryFn: async () => {
      const response = await adminApi.get(API_URLS.payments, { params: { page, limit } });
      return { ...withTotal({ ...response, data: response.data?.data ?? [] }), success: response.data?.success };
    },
    staleTime: 30 * 1000,
  });

export const useAdminFunding = ({ page = 1, limit = 100 } = {}) =>
  useQuery({
    queryKey: [...queryKeys.admin.funding, { page, limit }],
    queryFn: async () => {
      const response = await adminApi.get(API_URLS.funding, { params: { page, limit } });
      return withTotal(response);
    },
    staleTime: 30 * 1000,
  });
