import api from './api.service';

const getAll = async () => {
  try {
    const response = await api.get('employees');
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const getById = async (id: string) => {
  try {
    const response: any = await api.get(`employees/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const search = async (filter: any) => {
  try {
    const response: any = await api.get('employees/searchByKeyword', {
      params: filter,
    });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const create = async (data: any) => {
  try {
    const response: any = await api.post('employees', JSON.stringify(data), {
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
    const response: any = await api.put(`employees/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

const remove = async (id: string) => {
  try {
    const response: any = await api.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const EmployeeService = {
  getAll,
  getById,
  search,
  create,
  update,
  remove,
};
