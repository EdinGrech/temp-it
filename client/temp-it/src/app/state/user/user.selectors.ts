import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from './user.reducer';

export const selectUser = (state: AppState) => state.auth;

export const selectUserLoggedIn = createSelector(
  selectUser,
  (state: UserState) => state.loggedIn,
);

export const selectUserLoading = createSelector(
  selectUser,
  (state: UserState) => state.loading,
);

export const selectUserError = createSelector(
  selectUser,
  (state: UserState) => state.error,
);

export const selectUserUser = createSelector(
  selectUser,
  (state: UserState) => state.user,
);

export const forgotUserPasswordStatus = createSelector(
  selectUser,
  (state: UserState) => state.forgotPskProcess,
);

export const userAddSensorPin = createSelector(
  selectUser,
  (state: UserState) => state.pin
);

export const userAddSensorPinDateAdded = createSelector(
  selectUser,
  (state: UserState) => state.pinDateAdded
);

export const selectUserSensors = createSelector(
  selectUser,
  (state: UserState) => state.sensors
);

export const selectUserSensor = (id: number) => createSelector(
  selectUserSensors,
  (data) => data.find((s) => s.id === id),
);

export const selectUserSensorsLoading = createSelector(
  selectUser,
  (state: UserState) => state.loadingSensors
);

export const selectUserSensorsError = createSelector(
  selectUser,
  (state: UserState) => state.sensorError
);

export const selectUserSensorsLen = createSelector(
  selectUser,
  (state: UserState) => state.sensorLen
);