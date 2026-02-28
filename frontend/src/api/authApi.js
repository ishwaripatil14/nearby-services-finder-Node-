import { apiClient } from './client';

export const adminLogin = async ({ email, password }) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
};
