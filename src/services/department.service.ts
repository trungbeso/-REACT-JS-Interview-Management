import api from './api.service.ts';


const getAll = async () => {
   try {
      const response = await api.get('/departments');
      return response.data;
   } catch (error) {
      console.log('Error:', error);
   }
};

const getById = async (id: string) => {
   try {
      const response: any = await api.get(`/departments/${id}`);
      return response.data;
   } catch (error) {
      console.log('Error:', error);
   }
};

const create = async (data: any) => {
   try {
      const response: any = await api.post('/departments', data);
      return response.data;
   } catch (error) {
      console.log('Error:', error);
   }
}

const update = async (id: string, data: any) => {
   try {
      const response: any = await api.put(`/departments/${id}`, data);
      return response.data;
   } catch (error) {
      console.log('Error:', error);
   }
}

export const DepartmentService = {
   getAll,
   getById,
   create,
   update
}