import axios, { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
});

const login = async (data: any) => {
  try {
    const response = await api.post('/login', data);
    const { token, user } = response.data;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('userInformation', JSON.stringify(user));

    return response;
  } catch (error) {
    console.log('Error: ', error);
  }
};

const register = async (data: any) => {
  let toastId;
  try {
    toastId = toast.loading("Pending. . . ")
    const response: any = await api.post('/register', data);

    toast.success("Register Successfully ! Please Login !");
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    console.error('Error: ', error);
    toast.dismiss(toastId)
    toast.error("something went wrong");

  }
};

const resetPasswordRequest = async (data: any) => {
  try {
    const response: any = await api.post('/forgotPassword', data);
    return response.data;
  } catch (error) {
    console.error('Error: ', error);
   toast.error("something went wrong");
  }
};

export const AuthService = {
  login,
  register,
  resetPasswordRequest
};
