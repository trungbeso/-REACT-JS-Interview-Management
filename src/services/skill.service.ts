import api from './api.service.ts';


export const SkillService = {
    getAll: async () => {

       try{
        const response = await api.get('/skills');
        return response.data;
       }
       catch(error){

        console.log(error);
        
       }
    }
};


