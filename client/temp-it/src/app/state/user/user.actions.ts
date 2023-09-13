import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../interfaces/user';
import { createAction, props } from '@ngrx/store';
import {
  SensorDetails,
  singleSensorData,
} from 'src/app/interfaces/sensor/sensor';

export const loadUser = createAction('[User] User Offers');

export const loadUserSuccess = createAction(
  '[User] Load User Success',
  props<{ user: User }>(),
);

export const loadUserFailure = createAction(
  '[User] Load User Failure',
  props<{ error: any }>(),
);

export const loginUser = createAction(
  '[User] Login User',
  props<{ email: string; password: string }>(),
);

export const loginUserSuccess = createAction(
  '[User] Login User Success',
  props<{ user: any }>(),
);

export const loginUserFailure = createAction(
  '[User] Login User Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const registerUser = createAction(
  '[User] Register User',
  props<{ username: string; email: string; password: string }>(),
);

export const registerUserSuccess = createAction(
  '[User] Register User Success',
  props<{ user: User }>(),
);

export const registerUserFailure = createAction(
  '[User] Register User Failure',
  props<{ error: any }>(),
);

export const logoutUser = createAction('[User] Logout User');

export const logoutUserSuccess = createAction('[User] Logout User Success');

export const logoutUserFailure = createAction(
  '[User] Logout User Failure',
  props<{ error: any }>(),
);

export const updateUser = createAction(
  '[User] Update User',
  props<{ user: User }>(),
);

export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: User }>(),
);

export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: any }>(),
);

export const forgotUserPassword = createAction(
  '[User] Forgot User Password',
  props<{ email: string }>(),
);

export const forgotUserPasswordSuccess = createAction(
  '[User] Forgot User Password Success',
  props<{ forgotPskState: any }>(),
);

export const forgotUserPasswordFailure = createAction(
  '[User] Forgot User Password Failure',
  props<{ error: any }>(),
);
export const requestUserPin = createAction('[User] Request User Pin');
export const requestUserPinSuccess = createAction(
  '[User] Request User Pin Success',
  props<{ pin: number }>(),
);
export const requestUserPinFailure = createAction(
  '[User] Request User Pin Failure',
  props<{ error: any }>(),
);
export const requestUserSensors = createAction('[User] Request User Sensors');
export const requestUserSensorsSuccess = createAction(
  '[User] Request User Sensors Success',
  props<{ sensors: SensorDetails[] }>(),
);
export const requestUserSensorsFailure = createAction(
  '[User] Request User Sensors Failure',
  props<{ error: any }>(),
);
export const requestUserSensorLen = createAction(
  '[User] Request User Sensor Len',
);
export const requestUserSensorLenSuccess = createAction(
  '[User] Request User Sensor Len Success',
  props<{ sensorLen: number }>(),
);
export const requestUserSensorLenFailure = createAction(
  '[User] Request User Sensor Len Failure',
  props<{ error: any }>(),
);
export const requestUser24HourData = createAction(
  '[User] Request User 24 Hour Data',
  props<{ sensorId: number }>(),
);
export const requestUser24HourDataSuccess = createAction(
  '[User] Request User 24 Hour Data Success',
  props<{ sensorData: singleSensorData[] }>(),
);
export const requestUser24HourDataFailure = createAction(
  '[User] Request User 24 Hour Data Failure',
  props<{ error: any }>(),
);
