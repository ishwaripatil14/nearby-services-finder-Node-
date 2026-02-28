import { apiClient } from './client';

export const fetchAllServices = async (category) => {
  const params = {};
  if (category) params.category = category;
  const { data } = await apiClient.get('/services', { params });
  return data;
};

export const fetchNearbyServices = async ({ lat, lng, radius }) => {
  const params = { lat, lng, radius };
  const { data } = await apiClient.get('/services/nearby', { params });
  return data;
};

export const adminListServices = async () => {
  const { data } = await apiClient.get('/admin/services');
  return data;
};

export const adminCreateService = async (payload) => {
  const { data } = await apiClient.post('/services', payload);
  return data;
};

export const adminUpdateService = async (id, payload) => {
  const { data } = await apiClient.put(`/services/${id}`, payload);
  return data;
};

export const adminDeleteService = async (id) => {
  const { data } = await apiClient.delete(`/services/${id}`);
  return data;
};
