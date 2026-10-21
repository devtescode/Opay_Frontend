import { QueryClient } from '@tanstack/react-query';

/**
 * 4xx responses are deterministic (bad token, insufficient funds, validation...)
 * so retrying them just wastes requests. Network/5xx failures are transient
 * and worth a couple of retries.
 */
const isClientError = (error) => {
  const status = error?.response?.status;
  return typeof status === 'number' && status >= 400 && status < 500;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (isClientError(error)) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
