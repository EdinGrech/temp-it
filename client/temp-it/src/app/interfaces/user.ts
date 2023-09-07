export interface User {
  username: string;
  email: string;
}

export interface UserLoginInterface {
  email: string;
  password: string;
}

export interface UserSignUpResponse {
  status: number;
  email: string | [string];
  username: string | [string];
  password: string | [string];
}

export interface AuthTokens{
  access: string;
  refresh: string;
}

export interface RegisterResponse extends AuthTokens {
  user_data: {
    email: string;
    username: string;
  };
}
