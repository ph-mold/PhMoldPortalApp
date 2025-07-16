import apiClient from './apiClient';
import { ILoginBody, ILoginData } from '../../types/auth';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
};

export const authApi = {
  // 로그인
  login: async (body: ILoginBody): Promise<ILoginData> => {
    const { data } = await apiClient.post(AUTH_ENDPOINTS.LOGIN, body, {
      withCredentials: true,
    });
    return data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  },

  // 토큰 갱신
  refreshToken: async (): Promise<ILoginData> => {
    const { data } = await apiClient.post(AUTH_ENDPOINTS.REFRESH);
    return data;
  },
};
