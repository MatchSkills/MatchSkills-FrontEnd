import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from './env';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15000, // 15s timeout para lidar com cold-start do Render
  headers: {
    'Content-Type': 'application/json',
  },
});

let inMemoryToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryToken = token;
};

export const getAccessToken = () => inMemoryToken;

// Request interceptor: add Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (inMemoryToken && config.headers) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const storedRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('ms_refresh_token') : null;
        const refreshResponse = await axios.post(
          `${ENV.API_URL}/auth/refresh`,
          { refreshToken: storedRefreshToken || '' },
          {
            headers: {
              'Content-Type': 'application/json',
              ...(inMemoryToken ? { Authorization: `Bearer ${inMemoryToken}` } : {}),
            },
          }
        );

        const newAccessToken = refreshResponse.data?.accessToken;
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        setAccessToken(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/login/candidate';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
