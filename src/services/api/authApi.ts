import apiClient from './apiClient';
import { ILoginBody, ILoginData } from '../../types/auth';
import { cookieManager } from '../storage/cookieManager';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/user/me',
};

export const authApi = {
  // 로그인
  login: async (body: ILoginBody): Promise<ILoginData> => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, body, {
      withCredentials: true,
    });

    // 서버에서 받은 쿠키들을 저장
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      console.log('서버에서 받은 쿠키들:', cookies);
      for (const cookie of cookies) {
        // 쿠키 문자열에서 이름과 값을 추출
        const [nameValue] = cookie.split(';');
        const [name, value] = nameValue.split('=');
        if (name && value) {
          await cookieManager.setCookie(name.trim(), value.trim());
        }
      }
    }

    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await apiClient.post(
      AUTH_ENDPOINTS.LOGOUT,
      {},
      {
        withCredentials: true,
      },
    );
  },

  // 토큰 갱신
  refreshToken: async (): Promise<ILoginData> => {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.REFRESH,
      {},
      {
        withCredentials: true,
      },
    );

    // 서버에서 받은 쿠키들을 저장
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      console.log('토큰 갱신 시 받은 쿠키들:', cookies);
      for (const cookie of cookies) {
        const [nameValue] = cookie.split(';');
        const [name, value] = nameValue.split('=');
        if (name && value) {
          await cookieManager.setCookie(name.trim(), value.trim());
        }
      }
    }

    return response.data;
  },

  // 사용자 정보 확인 (access_token 유효성 검증)
  checkUser: async (): Promise<any> => {
    const { data } = await apiClient.get(AUTH_ENDPOINTS.ME, {
      withCredentials: true,
    });
    return data;
  },
};
