import { UserState } from './user/user.reducer';
export interface AppState {
  auth: UserState;
}
