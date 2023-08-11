import { User } from './../../interfaces/user';
import { createReducer, on, createFeature } from '@ngrx/store';
import {
  loadUser,
  loadUserSuccess,
  loadUserFailure,
  loginUser,
  loginUserSuccess,
  loginUserFailure,
  registerUser,
  registerUserSuccess,
  registerUserFailure,
  logoutUser,
  logoutUserSuccess,
  logoutUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  forgotUserPassword,
  forgotUserPasswordSuccess,
  forgotUserPasswordFailure,
  requestUserPin,
  requestUserPinFailure,
  requestUserPinSuccess,
  requestUserSensors,
  requestUserSensorsSuccess,
  requestUserSensorsFailure,
  requestUserSensorLen,
  requestUserSensorLenSuccess,
  requestUser24HourData,
  requestUser24HourDataSuccess,
  requestUser24HourDataFailure,
} from './user.actions';
import { SensorDetails, singleSensorData } from 'src/app/interfaces/sensor/sensor';

export interface UserState {
  user: User;
  error: any;
  pin?: number;
  pinDateAdded?: Date;
  forgotPskProcess: any;
  loading: boolean;
  loggedIn: boolean;
  sensors: SensorDetails[];
  loadingSensors: boolean;
  sensorError: any;
  sensorLen?: number;
  sensor24HourData?: singleSensorData[];
}

export const initialUserState: UserState = {
  user: {
    username: '',
    email: '',
  },
  forgotPskProcess: null,
  error: null,
  loading: false,
  loggedIn: false,
  sensors: [],
  loadingSensors: false,
  sensorError: null,
};

export const userAuthReducer = createReducer(
  initialUserState,
  on(loadUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    loggedIn: true,
  })),
  on(loadUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    loggedIn: false,
  })),
  on(loginUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(loginUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    loggedIn: true,
  })),
  on(loginUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    loggedIn: false,
  })),
  on(registerUser, (state) => ({
    ...state,
    loading: true,
    loggedIn: false,
  })),
  on(registerUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    loggedIn: false,
  })),
  on(registerUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    loggedIn: false,
  })),
  on(logoutUser, (state) => ({
    ...state,
    loading: true,
    loggedIn: false,
  })),
  on(logoutUserSuccess, (state) => ({
    ...state,
    user: {
      username: '',
      email: '',
    },
    loading: false,
  })),
  on(logoutUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(updateUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(updateUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(updateUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(forgotUserPassword, (state) => ({
    ...state,
    forgotPskProcess: null,
    error: null,
    loading: true,
  })),
  on(forgotUserPasswordSuccess, (state, { forgotPskState }) => ({
    ...state,
    forgotPskProcess: forgotPskState,
    error: null,
    loading: false,
  })),
  on(forgotUserPasswordFailure, (state, { error }) => ({
    ...state,
    forgotPskProcess: null,
    error,
    loading: false,
  })),
  on(requestUserPin, (state) => ({
    ...state,
  })),
  on(requestUserPinSuccess, (state, { pin }) => ({
    ...state,
    pin: pin,
    pinDateAdded: new Date(),
  })),
  on(requestUserPinFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(requestUserSensors, (state) => ({
    ...state,
    loadingSensors: true,
  })),
  on(requestUserSensorsSuccess, (state, { sensors }) => ({
    ...state,
    sensors: sensors,
    loadingSensors: false,
  })),
  on(requestUserSensorsFailure, (state, { error }) => ({
    ...state,
    sensorError: error,
    loadingSensors: false,
  })),
  on(requestUserSensorLen, (state) => ({
    ...state,
    loadingSensors: true,
  })),
  on(requestUserSensorLenSuccess, (state, { sensorLen }) => ({
    ...state,
    sensorLen: sensorLen,
    loadingSensors: false,
  })),
  on(requestUserSensorsFailure, (state, { error }) => ({
    ...state,
    sensorError: error,
    loadingSensors: false,
  })),
  on(requestUser24HourData, (state) => ({
    ...state,
    loadingSensors: true,
  })),
  on(requestUser24HourDataSuccess, (state, { sensorData }) => ({
    ...state,
    sensor24HourData: sensorData,
    loadingSensors: false,
  })),
  on(requestUser24HourDataFailure, (state, { error }) => ({
    ...state,
    sensorError: error,
    loadingSensors: false,
  }))
);
