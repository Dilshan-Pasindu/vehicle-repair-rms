import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - Replace with live backend URL upon deployment (e.g., Render/Choreo URL)
// As requested, no .env file is used for the frontend
export const BASE_URL = 'http://localhost:5000/api/v1'; 

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token from AsyncStorage', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
