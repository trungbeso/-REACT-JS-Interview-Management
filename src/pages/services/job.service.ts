import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/jobs'
});

const getAll = async () => {
    try {
        const response = await api.get("");
        console.log(response.data);
        
        return response.data;
    } catch (error) {
        console.log('Error:', error);
    }
};

const getById = async (id: string) => {
    try {
        const response: any = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.log('Error:', error);
    }
};

const search = async (filter: any) => {
    try {
        const response: any = await api.get('/search', { params: filter });
        return response.data;
    } catch (error) {
        console.log('Error:', error);
    }
}

const create = async (data: any) => {
    try {
        const response: any = await api.post('', data);
        return response.data;
    } catch (error) {
        console.log('Error:', error);
    }
}

const update = async (id: string, data: any) => {
    try {
        const response: any = await api.put(`/${id}`, data);
        return response.data;
    } catch (error) {
        console.log('Error:', error);
    }
}

const remove = async (id: string) => {
    try {
        const response: any = await api.delete<boolean>(`/${id}`);
        return response.data;
    } catch (error) {
        console.log('Error:', error);
    }
}

const getStatuses = async () => {
    try {
        const response = await api.get('/statuses'); // Đường dẫn `/statuses` là ví dụ, thay đổi nếu cần
        return response.data;
    } catch (error) {
        console.error('Error fetching statuses:', error);
        return [];
    }
};

const searchByStatus = async (filter: any) => {
    try {
        const response: any = await api.get('/status', { params: filter });
        return response.data;
    } catch (error) {
        console.log('Error:', error);
    }
};

// Import Jobs API
const importJobs = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await api.post('/upload', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error importing jobs:", error);
        throw new Error("Không thể import file!");
    }
};

// Export Jobs API
const exportJobs = async () => {
    try {
        const response = await api.get('/export', { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'jobs.xlsx';
        link.click();
        return true;
    } catch (error) {
        console.error("Error exporting jobs:", error);
        throw new Error("Không thể export file!");
    }
};


export const JobService = {
    getAll,
    getById,
    search,
    create,
    update,
    remove,
    getStatuses,
    searchByStatus,
    importJobs,
    exportJobs
}