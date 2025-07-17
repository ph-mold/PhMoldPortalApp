import AsyncStorage from '@react-native-async-storage/async-storage';

// 쿠키 관리를 위한 유틸리티
export const cookieManager = {
  // 쿠키 설정 (웹뷰에서 사용할 수 있도록 AsyncStorage에 저장)
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

  // 웹뷰용 쿠키 스크립트 생성
  getCookieScript: async (): Promise<string> => {
    const keys = await AsyncStorage.getAllKeys();
    const cookieKeys = keys.filter(key => key.startsWith('cookie_'));
    const cookies: { [key: string]: string } = {};

    for (const key of cookieKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        const cookieName = key.replace('cookie_', '');
        cookies[cookieName] = value;
      }
    }

    // 쿠키가 없는 경우 빈 스크립트 반환
    if (Object.keys(cookies).length === 0) {
      return 'true;';
    }

    return `
      (function() {
        try {
          const cookies = ${JSON.stringify(cookies)};
          Object.keys(cookies).forEach(name => {
            const value = cookies[name];
            const cookieString = name + '=' + value + '; path=/; domain=.phmold.co.kr; secure; samesite=strict';
            document.cookie = cookieString;
            console.log('쿠키 설정:', name, value);
          });
          console.log('총 ${Object.keys(cookies).length}개의 쿠키 설정 완료');
        } catch (error) {
          console.error('쿠키 설정 중 오류:', error);
        }
        true;
      })();
    `;
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
