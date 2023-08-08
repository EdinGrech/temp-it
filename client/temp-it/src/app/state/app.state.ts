import { UserState, userAuthReducer } from './user/user.reducer';
import { GlobalState, globeReducer } from './global/global.reducer';
import { combineReducers } from '@ngrx/store';
export interface AppState {
  auth: UserState;
  global: GlobalState;
}

export const AppReducer = combineReducers({
  auth: userAuthReducer,
  global: globeReducer,
});
