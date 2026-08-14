import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from './env';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15000, // 15s timeout para lidar com cold-start do Render
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jobPostingApiClient = axios.create({
  baseURL: ENV.JOB_POSTING_API_URL,
  timeout: 15000, // 15s timeout para lidar com cold-start do Render
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mockApiClient = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let inMemoryToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryToken = token;
};

export const getAccessToken = (): string | null => {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window !== 'undefined') {
    return (
      localStorage.getItem('matchskills_access_token') ||
      localStorage.getItem('ms_access_token') ||
      null
    );
  }
  return null;
};

// Helper to set headers on requests
const attachAuthHeaders = (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.Authentication = `Bearer ${token}`;
  }
  return config;
};

mockApiClient.interceptors.request.use(attachAuthHeaders, (error) => Promise.reject(error));
jobPostingApiClient.interceptors.request.use(attachAuthHeaders, (error) => Promise.reject(error));
apiClient.interceptors.request.use(attachAuthHeaders, (error) => Promise.reject(error));

// Shared 401 refresh handler
const createAuthResponseInterceptor = (clientInstance: typeof apiClient) => async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const storedRefreshToken =
        typeof window !== 'undefined' ? localStorage.getItem('ms_refresh_token') : null;
      const currentToken = getAccessToken();
      const refreshResponse = await axios.post(
        `${ENV.API_URL}/auth/refresh`,
        { refreshToken: storedRefreshToken || '' },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(currentToken
              ? {
                  Authorization: `Bearer ${currentToken}`,
                  Authentication: `Bearer ${currentToken}`,
                }
              : {}),
          },
        }
      );

      const newAccessToken = refreshResponse.data?.accessToken;
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('matchskills_access_token', newAccessToken);
        }
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authentication = `Bearer ${newAccessToken}`;
        }
        return clientInstance(originalRequest);
      }
    } catch (refreshError) {
      setAccessToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('matchskills_access_token');
        window.location.href = '/login/candidate';
      }
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

// Response interceptor: handle 401 & refresh for both API clients
apiClient.interceptors.response.use((response) => response, createAuthResponseInterceptor(apiClient));
jobPostingApiClient.interceptors.response.use(
  (response) => response,
  createAuthResponseInterceptor(jobPostingApiClient)
);
