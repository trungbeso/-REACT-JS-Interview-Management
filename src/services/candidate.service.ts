import { CandidateStatus } from '../constants/enum';
import api from './api.service';

const getAll = async () => {
  try {
    const response = await api.get('/candidates');
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const getById = async (id: string) => {
  try {
    const response: any = await api.get(`/candidates/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const search = async (filter: any) => {
  try {
    const response: any = await api.get('/candidates/search', {
      params: filter,
    });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const create = async (data: any) => {
  try {
    const response: any = await api.post(
      '/candidates/create',
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const update = async (id: string, data: any) => {
  try {
    const response: any = await api.put(`/candidates/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const remove = async (id: string) => {
  try {
    const response: any = await api.delete<boolean>(`candidates/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const updateStatus = async (id: string, status: CandidateStatus) => {
  try {
    const response: any = await api.patch(
      `/candidates/${id}/status?status=${status}`,
    );
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const CandidateService = {
  getAll,
  getById,
  search,
  create,
  update,
  remove,
  updateStatus,
};
