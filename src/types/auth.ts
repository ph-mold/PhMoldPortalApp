// 로그인 요청 데이터
export interface ILoginBody {
  email: string;
  password: string;
}

// 로그인 응답 데이터
export interface ILoginData {
  accessToken: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// 사용자 정보
export interface IUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}
