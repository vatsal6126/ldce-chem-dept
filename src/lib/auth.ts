/**
 * Admin Authentication & Security Management
 * 
 * Allows the admin to define and set their own custom username and password.
 * Manages active login sessions and protects sensitive CMS actions and Cloud API keys.
 */

interface AdminCredentials {
  username: string;
  passwordHash: string;
}

const SESSION_KEY = 'ldce_admin_session_token';
const CREDENTIALS_KEY = 'ldce_admin_custom_credentials';

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

const getDefaultCredentials = (): AdminCredentials => {
  const envUser = (import.meta.env.VITE_ADMIN_USERNAME as string) || '';
  const envPass = (import.meta.env.VITE_ADMIN_PASSWORD as string) || '';
  return {
    username: envUser || 'admin',
    passwordHash: hashString(envPass || 'admin123'),
  };
};

const getCustomCredentials = (): AdminCredentials | null => {
  try {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return null;
};

export const getStoredCredentials = (): AdminCredentials => {
  const custom = getCustomCredentials();
  if (custom && custom.username && custom.passwordHash) return custom;
  return getDefaultCredentials();
};

export const verifyAdminLogin = (usernameInput: string, passwordInput: string): boolean => {
  const creds = getStoredCredentials();
  const inputUser = usernameInput.trim();
  const inputHash = hashString(passwordInput.trim());

  if (creds.username && creds.passwordHash !== hashString('') && inputUser === creds.username && inputHash === creds.passwordHash) {
    const token = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem(SESSION_KEY, token);
    return true;
  }
  return false;
};

export const isAdminAuthenticated = (): boolean => {
  return !!sessionStorage.getItem(SESSION_KEY);
};

export const logoutAdminSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
};

export const changeAdminCredentials = (currentPassword: string, newUsername: string, newPassword: string): { success: boolean; error?: string } => {
  const creds = getStoredCredentials();
  const currentHash = hashString(currentPassword.trim());

  if (currentHash !== creds.passwordHash) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  if (!newUsername.trim()) {
    return { success: false, error: 'Username cannot be empty.' };
  }

  if (!newPassword.trim() || newPassword.trim().length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  const newCreds: AdminCredentials = {
    username: newUsername.trim(),
    passwordHash: hashString(newPassword.trim()),
  };

  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(newCreds));
  return { success: true };
};

