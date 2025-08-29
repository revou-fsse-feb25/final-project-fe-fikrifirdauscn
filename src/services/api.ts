import axios from 'axios';

const RAW = process.env.NEXT_PUBLIC_API_URL || '';      // set di Vercel: https://<railway-app>.up.railway.app
const BASE = RAW.replace(/\/+$/, '');                   // buang trailing slash

export const apiClient = axios.create({
  baseURL: `${BASE}/api`,                               // ⬅️ tambahkan prefix /api
  headers: { 'Content-Type': 'application/json' },
});

// opsional: auto-attach Bearer dari localStorage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('token');
    if (t) config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});
