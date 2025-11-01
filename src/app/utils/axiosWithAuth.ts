import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { AxiosErrorResponse } from '../types';

type RefreshAccessTokenResponse = {
  message: string;
  data: {
    accessToken: string;
    user: {
      userId: string;
      name: string;
      email: string;
      phone: string;
    };
  };
};

const axiosWithAuth = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let refreshing: Promise<AxiosResponse<RefreshAccessTokenResponse>> | undefined = undefined;

const getNewAccessToken = () => {
  const refreshPayload: AxiosRequestConfig = {
    method: 'GET',
    withCredentials: true,
    baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL,
    url: '/auth/refresh-token',
  };
  return axios<RefreshAccessTokenResponse>(refreshPayload);
};

const refreshAccessToken = () => {
  if (!refreshing) {
    refreshing = getNewAccessToken();
  }
  return refreshing;
};

axiosWithAuth.interceptors.request.use(async (request) => {
  const authorization = axiosWithAuth.defaults.headers.common['Authorization'];
  if (!authorization) {
    const { data: newAccessToken } = await refreshAccessToken();
    const { data } = newAccessToken;
    refreshing = undefined;
    const accessToken = 'Bearer ' + data.accessToken;
    axiosWithAuth.defaults.headers.common['Authorization'] = accessToken;
    request.headers['Authorization'] = accessToken;
  }
  return request;
});

axiosWithAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosErrorResponse) => {
    const originalRequest: Partial<InternalAxiosRequestConfig> = error.config || {};
    if (error?.response?.status === 401) {
      const { data: newAccessToken } = await refreshAccessToken();
      const { data } = newAccessToken;
      refreshing = undefined;
      const accessToken = 'Bearer ' + data.accessToken;
      axiosWithAuth.defaults.headers.common['Authorization'] = accessToken;
      originalRequest.headers?.set('Authorization', accessToken);
      return axiosWithAuth(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default axiosWithAuth;
