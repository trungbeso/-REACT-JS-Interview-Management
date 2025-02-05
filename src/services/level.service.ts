import api from './api.service';

export const LevelService = {
  getAll: async () => {
    const response = await api.get('levels');
    return response.data; // Trả về danh sách level
  },
};
