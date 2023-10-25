import { UserState, userAuthReducer } from './user/user.reducer';
import { GlobalState, globeReducer } from './global/global.reducer';
import { SensorState, sensorReducer } from './sensor/sensor.reducer';
import { GroupState, groupReducer } from './group/group.reducer';
import { combineReducers } from '@ngrx/store';
export interface AppState {
  auth: UserState;
  global: GlobalState;
  sensor: SensorState;
  group: GroupState;
}

export const AppReducer = combineReducers({
  auth: userAuthReducer,
  global: globeReducer,
  sensor: sensorReducer,
  group: groupReducer,
});
