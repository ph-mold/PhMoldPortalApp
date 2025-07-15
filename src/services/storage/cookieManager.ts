import AsyncStorage from '@react-native-async-storage/async-storage';

// 쿠키 관리를 위한 유틸리티
export const cookieManager = {
  // 리프레시 토큰을 쿠키로 설정 (웹뷰에서 사용)
  setRefreshTokenCookie: async (token: string): Promise<void> => {
    // AsyncStorage에 저장 (웹뷰에서 접근 가능)
    await AsyncStorage.setItem('refreshToken', token);
  },

  // 리프레시 토큰 쿠키 가져오기
  getRefreshTokenCookie: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('refreshToken');
  },

  // 쿠키 삭제
  clearCookies: async (): Promise<void> => {
    await AsyncStorage.multiRemove(['refreshToken']);
  },
};
