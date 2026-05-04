import { getToken } from './auth';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => request<any>('/auth/me'),
  },
  invoices: {
    list: (params?: { search?: string; status?: string }) => {
      const q = new URLSearchParams(params as Record<string, string>).toString();
      return request<any[]>(`/invoices${q ? `?${q}` : ''}`);
    },
    get: (id: string) => request<any>(`/invoices/${id}`),
    create: (data: any) => request<any>('/invoices', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<any>(`/invoices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    stats: () => request<any>('/invoices/stats'),
  },
  customers: {
    list: (search?: string) => request<any[]>(`/customers${search ? `?search=${search}` : ''}`),
    get: (id: string) => request<any>(`/customers/${id}`),
  },
  ai: {
    fastlane: (input: string) => request<any>('/ai/fastlane', { method: 'POST', body: JSON.stringify({ input }) }),
  },
};
