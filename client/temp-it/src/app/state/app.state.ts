import { UserState } from './user/user.reducer';
import { GlobalState } from './global/global.reducer';
export interface AppState {
  auth: UserState;
  global: GlobalState;
}
