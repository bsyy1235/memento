// utils/api.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';
const api = axios.create({ baseURL: BASE_URL });

let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function login(email: string, password: string) {
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);
  form.append('grant_type', 'password');

  const response = await api.post('/api/auth/login/access-token', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const token = response.data.access_token;
  setAccessToken(token);
  return response.data;
}

export async function getUserMe() {
  const response = await api.get('/api/user/me');
  return response.data;
}
