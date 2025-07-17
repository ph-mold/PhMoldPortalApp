import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_INFO: 'userInfo',
  IS_LOGGED_IN: 'isLoggedIn',
};

export const authStorage = {
  // 사용자 정보 저장
  setUserInfo: async (userInfo: any): Promise<void> => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_INFO,
      JSON.stringify(userInfo),
    );
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
  },

  // 사용자 정보 가져오기
  getUserInfo: async (): Promise<any | null> => {
    const userInfo = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // 로그인 상태 설정
  setLoggedIn: async (): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
  },

  // 로그인 상태 확인
  isLoggedIn: async (): Promise<boolean> => {
    const isLoggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return isLoggedIn === 'true';
  },

  // 모든 인증 데이터 삭제
  clearAuthData: async (): Promise<void> => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_INFO,
      STORAGE_KEYS.IS_LOGGED_IN,
    ]);
  },
};
