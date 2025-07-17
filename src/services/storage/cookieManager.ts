import AsyncStorage from '@react-native-async-storage/async-storage';

// 쿠키 관리를 위한 유틸리티 (API 요청용)
export const cookieManager = {
  // 쿠키 설정 (AsyncStorage에 저장)
  setCookie: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(`cookie_${name}`, value);
  },

  // 쿠키 가져오기
  getCookie: async (name: string): Promise<string | null> => {
    return await AsyncStorage.getItem(`cookie_${name}`);
  },

  // 모든 쿠키 키 가져오기
  getAllCookieKeys: async (): Promise<string[]> => {
    const keys = await AsyncStorage.getAllKeys();
    const cookieKeys = keys.filter(key => key.startsWith('cookie_'));
    return cookieKeys.map(key => key.replace('cookie_', ''));
  },

  // 모든 쿠키 삭제
  clearAllCookies: async (): Promise<void> => {
    const keys = await AsyncStorage.getAllKeys();
    const cookieKeys = keys.filter(key => key.startsWith('cookie_'));
    if (cookieKeys.length > 0) {
      await AsyncStorage.multiRemove(cookieKeys);
    }
  },

  // 특정 쿠키 삭제
  removeCookie: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(`cookie_${name}`);
  },

  // 쿠키 디버깅용 로그
  logCookies: async (): Promise<void> => {
    const keys = await AsyncStorage.getAllKeys();
    const cookieKeys = keys.filter(key => key.startsWith('cookie_'));
    console.log('저장된 쿠키 키들:', cookieKeys);

    for (const key of cookieKeys) {
      const value = await AsyncStorage.getItem(key);
      console.log(`쿠키 ${key}:`, value);
    }
  },
};
