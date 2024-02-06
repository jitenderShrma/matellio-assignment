import axios from 'axios';
import { baseURL } from '../config/config';


// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(`${baseURL}/api/v1/auth/refresh-token`, { refreshToken });
    // Update the localStorage with the new access token
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data.newAccessToken;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};

const handleApiCall = async (apiCall, ...args) => {
  try {
    return await apiCall(...args);
  } catch (error) {
    // If the error response is 403 (Forbidden) and we haven't retried yet
    if (error.response && error.response.status === 403 && !error.config.retry) {
      error.config.retry = true;
      try {
        const newAccessToken = await refreshAccessToken(); // update the auth header with the new access token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`; // retry the call
        return await apiCall(...args);
      } catch (refreshError) {
        throw new Error('Failed to refresh access token');
      }
    } else {
      return error.response;// because error is not due to a 403 response
    }
  }
};


export const loginUser = async (inputBody) => {
  try {
    const response = await handleApiCall(axios.post, `${baseURL}/api/v1/auth/login`, inputBody);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const registerUser = async (inputBody) => {
  try {
    const response = await handleApiCall(axios.post, `${baseURL}/api/v1/auth/register`, inputBody);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getPersonalDetails = async () => {
  const token = localStorage.getItem('accessToken');
  return await handleApiCall(axios.get, `${baseURL}/api/v1/users/address`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const submitPersonalDetails = async (formData) => {
  const token = localStorage.getItem('accessToken');
  return await handleApiCall(axios.post, `${baseURL}/api/v1/users/address`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
