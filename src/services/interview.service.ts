import { InterviewResult, InterviewStatus } from '../constants/enum';
import api from './api.service';

const getAll = async () => {
  try {
    const response = await api.get('/interviews');
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const getById = async (id: string) => {
  try {
    const response: any = await api.get(`/interviews/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const search = async (filter: any) => {
  try {
    const response: any = await api.get('/interviews/search', {
      params: filter,
    });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const create = async (data: any) => {
  try {
    const response: any = await api.post('/interviews', JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const update = async (id: string, data: any) => {
  try {
    const response: any = await api.put(`/interviews/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const remove = async (id: string) => {
  try {
    const response: any = await api.delete<boolean>(`interviews/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const updateStatus = async (id: string, status: InterviewStatus) => {
  try {
    const response: any = await api.patch(
      `/interviews/${id}/status?status=${status}`,
    );
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const updateResultAndNote = async (
  id: string,
  result: InterviewResult,
  note: string,
) => {
  try {
    const response: any = await api.patch(
      `/interviews/${id}/result?result=${result}&note=${note}`,
    );
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const sendReminder = async (id: string) => {
  try {
    const response: any = await api.post(`/interviews/${id}/send-reminder`);
    return response.data;
  } catch (error) {
    console.log('Error sending reminder:', error);
  }
};

export const InterviewService = {
  getAll,
  getById,
  search,
  create,
  update,
  remove,
  updateStatus,
  updateResultAndNote,
  sendReminder,
};
