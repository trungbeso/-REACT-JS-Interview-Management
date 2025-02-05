import api from './api.service.ts';

export const BenefitService = {
    getAll: async () => {

       try{
        const response = await api.get('benefits');
        return response.data;
       }
       catch(error){

        console.log(error);
        
       }
    }
};

