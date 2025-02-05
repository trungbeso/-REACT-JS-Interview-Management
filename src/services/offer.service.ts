import { OfferStatus } from '../constants/enum';
import api from './api.service';

const getAll = async () => {
  try {
    const response = await api.get('/offers');
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const getById = async (id: string) => {
  try {
    const response: any = await api.get(`/offers/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const search = async (filter: any) => {
  try {
    const response: any = await api.get('/offers/search', { params: filter });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const create = async (data: any) => {
  try {
    const response: any = await api.post('/offers', data);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const update = async (id: string, data: any) => {
  try {
    const response: any = await api.put(`/offers/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const remove = async (id: string) => {
  try {
    const response: any = await api.delete<boolean>(`/offers/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const updateStatus = async (id: string, status: OfferStatus) => {
  try {
    const response: any = await api.patch(
      `/offers/${id}/status?status=${status}`,
    );
    return response.data;
  } catch (error) {
    console.log('error:', error);
  }
};

export const OfferService = {
  getAll,
  getById,
  search,
  create,
  update,
  remove,
  updateStatus,
};
