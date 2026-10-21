import { useCallback, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  ADMIN_TOKEN_KEY,
  SESSION_ID_KEY,
  TOKEN_KEY,
  USER_KEY,
  clearAdminSession,
  clearUserSession,
  getStoredUser,
  getToken,
} from './apiClient';
import { useNavigate } from 'react-router-dom';

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return false;
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * Reads the signed-in user from localStorage and keeps it in sync with
 * storage events (e.g. a forced logout from another tab).
 */
export const useCurrentUser = () => {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const token = getToken();
  const isAuthenticated = Boolean(token) && !isTokenExpired(token);

  return {
    user,
    token,
    userId: user?.userId ?? null,
    sessionId: user?.sessionId ?? localStorage.getItem(SESSION_ID_KEY) ?? null,
    isAuthenticated,
    isExpired: Boolean(token) && isTokenExpired(token),
  };
};



export const useLogout = () => {
  const navigate = useNavigate();

  const logoutUser = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_ID_KEY);

    navigate("/", { replace: true });
  }, [navigate]);

  const logoutAdmin = useCallback(() => {
    clearAdminSession();

    navigate("/admin", { replace: true });
  }, [navigate]);

  return { logoutUser, logoutAdmin };
};
export { TOKEN_KEY, ADMIN_TOKEN_KEY, USER_KEY, SESSION_ID_KEY };
