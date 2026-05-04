export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('invoicefast_token');
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('invoicefast_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setAuth(token: string, user: AuthUser) {
  localStorage.setItem('invoicefast_token', token);
  localStorage.setItem('invoicefast_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('invoicefast_token');
  localStorage.removeItem('invoicefast_user');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
