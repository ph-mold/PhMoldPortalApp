import axios from 'axios';
import { cookieManager } from '../storage/cookieManager';
import Config from 'react-native-config';
const API_URL = Config.API_URL || 'http://api.phmold.co.kr';

// axios 인스턴스 생성 - 쿠키 기반 인증
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 자동 전송
});

// 요청 인터셉터 - 저장된 쿠키를 헤더에 추가
apiClient.interceptors.request.use(
  async config => {
    try {
      // 저장된 쿠키들을 가져와서 Cookie 헤더에 설정
      const keys = await cookieManager.getAllCookieKeys();
      const cookieStrings: string[] = [];

      for (const key of keys) {
        const value = await cookieManager.getCookie(key);
        if (value) {
          cookieStrings.push(`${key}=${value}`);
        }
      }

      if (cookieStrings.length > 0) {
        config.headers.Cookie = cookieStrings.join('; ');
        console.log('요청에 쿠키 추가:', config.headers.Cookie);
      }
    } catch (error) {
      console.error('쿠키 설정 중 오류:', error);
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 401 에러 처리
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 401 에러는 각 API에서 개별적으로 처리
    return Promise.reject(error);
  },
);

export default apiClient;
