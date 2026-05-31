const ADMIN_TOKEN_KEY = 'lacrose_admin_token';
const ADMIN_USER = import.meta.env.VITE_ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin123';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 heures

export function verifyAdminCredentials(username: string, password: string) {
  return username === ADMIN_USER && password === ADMIN_PASSWORD;
}

export function createAdminSession() {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const token = btoa(`${ADMIN_USER}:${expiry}`);
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function removeAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminSessionActive() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) return false;
  try {
    const expiry = parseInt(atob(token).split(':')[1]);
    if (Date.now() > expiry) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    return false;
  }
}
