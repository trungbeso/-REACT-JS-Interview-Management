import api from './api.service.ts';


const getAll = async () => {
   try {
      const response = await api.get('/roles');
      return response.data;
   } catch (error) {
      console.log('Error:', error);
   }
};

const getById = async (id: string) => {
   try {
      const response: any = await api.get(`/roles/${id}`);
      return response.data;
   } catch (error) {
      console.log('Error:', error);
   }
};

const search = async (filter: any) => {
   try {
      const response: any = await api.get('/roles/searchByKeyword', { params: filter });
      return response.data;
   } catch (error) {
      console.log('Error:', error);
   }
}


export const RoleService = {
   getAll,
   getById,
   search
}