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
