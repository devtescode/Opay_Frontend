import axios from 'axios';
import { baseURL } from '../../config';

export const TOKEN_KEY = 'token';
export const ADMIN_TOKEN_KEY = 'adminToken';
export const USER_KEY = 'user';
export const SESSION_ID_KEY = 'sessionId';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const clearUserSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  // localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

/**
 * Instance for user-scoped requests. Attaches the user JWT automatically.
 */
export const api = axios.create({ baseURL });

/**
 * Instance for admin-scoped requests. Attaches the admin JWT automatically.
 */
export const adminApi = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !config.skipAuth) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token && !config.skipAuth) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleUserUnauthorized = () => {
  clearUserSession();
  if (window.location.pathname !== '/') {
    window.location.replace('/');
  }
};

const handleAdminUnauthorized = () => {
  clearAdminSession();
  if (window.location.pathname !== '/admin') {
    window.location.replace('/admin');
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && !error?.config?.skipAuthRedirect) {
      handleUserUnauthorized();
    }
    return Promise.reject(error);
  },
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && !error?.config?.skipAuthRedirect) {
      handleAdminUnauthorized();
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || error?.message || fallback;

export default api;
