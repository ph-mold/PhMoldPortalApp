import { authApi } from './api/authApi';
import { authStorage } from './storage/authStorage';
import { cookieManager } from './storage/cookieManager';

export class AuthService {
  // 앱 시작 시 인증 상태 확인
  static async checkAuthStatus(): Promise<{
    isAuthenticated: boolean;
    user?: any;
  }> {
    try {
      // 저장된 쿠키가 있는지 확인
      const cookieKeys = await cookieManager.getAllCookieKeys();
      console.log('저장된 쿠키 키들:', cookieKeys);

      if (cookieKeys.length === 0) {
        console.log('저장된 쿠키가 없음 - 로그인 필요');
        return { isAuthenticated: false };
      }

      // 서버에 사용자 정보 요청 (저장된 쿠키 사용)
      const user = await authApi.checkUser();

      // 사용자 정보 저장 및 로그인 상태 설정
      await authStorage.setUserInfo(user);
      await authStorage.setLoggedIn();

      console.log('쿠키 기반 인증 성공');
      return { isAuthenticated: true, user };
    } catch (error: any) {
      console.log('사용자 정보 확인 실패:', error.response?.status);

      // 401 에러인 경우 refresh token으로 재시도
      if (error.response?.status === 401) {
        console.log('401 에러 - 토큰 갱신 시도');
        return await this.refreshToken();
      }

      // 다른 에러인 경우 로그아웃 처리
      console.log('인증 실패 - 로그아웃 처리');
      await this.logout();
      return { isAuthenticated: false };
    }
  }

  // 토큰 갱신
  static async refreshToken(): Promise<{
    isAuthenticated: boolean;
    user?: any;
  }> {
    try {
      console.log('토큰 갱신 시작');
      const response = await authApi.refreshToken();

      // 새로운 사용자 정보로 업데이트
      if (response.user) {
        await authStorage.setUserInfo(response.user);
      }
      await authStorage.setLoggedIn();

      console.log('토큰 갱신 성공');
      return { isAuthenticated: true, user: response.user };
    } catch (error) {
      console.log('토큰 갱신 실패:', error);

      // refresh token도 만료된 경우 로그아웃
      await this.logout();
      return { isAuthenticated: false };
    }
  }

  // 로그인
  static async login(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      console.log('로그인 시작');
      const response = await authApi.login({ email, password });

      // 사용자 정보 저장 및 로그인 상태 설정
      if (response.user) {
        await authStorage.setUserInfo(response.user);
      }
      await authStorage.setLoggedIn();

      // 쿠키 디버깅
      await cookieManager.logCookies();

      console.log('로그인 성공');
      return { success: true, user: response.user };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || '로그인에 실패했습니다.';
      console.log('로그인 실패:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // 로그아웃
  static async logout(): Promise<void> {
    try {
      // 서버에 로그아웃 요청
      await authApi.logout();
    } catch (error) {
      console.log('서버 로그아웃 실패:', error);
    } finally {
      // 로컬 데이터 삭제
      await authStorage.clearAuthData();
      await cookieManager.clearAllCookies();
      console.log('로그아웃 완료');
    }
  }
}
