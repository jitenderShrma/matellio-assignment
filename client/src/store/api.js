import axios from 'axios';
import {baseURL} from '../config/config';
export const loginUser = async (inputBody) => {
  try {
    const response = await axios.post(`${baseURL}/api/v1/auth/login`, inputBody);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const registerUser = async (inputBody) => {
  try {
    const response = await axios.post(`${baseURL}/api/v1/auth/register`, inputBody);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getPersonalDetails = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${baseURL}/api/v1/users/address`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const submitPersonalDetails = async (formData) => {
  try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${baseURL}/api/v1/users/address`, formData, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      return error.response.data;
  }
};