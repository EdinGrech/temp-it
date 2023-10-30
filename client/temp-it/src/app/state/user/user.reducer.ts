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
  // requestUserSensors,
  // requestUserSensorsSuccess,
  // requestUserSensorsFailure,
  // requestUserSensorLen,
  // requestUserSensorLenSuccess,
  // requestUser24HourData,
  // requestUser24HourDataSuccess,
  // requestUser24HourDataFailure,
} from './user.actions';
import {
  SensorDetails,
  SensorReadingData,
} from 'src/app/interfaces/sensor/sensor';

export interface UserState {
  user: User;
  error: any;
  pin?: number;
  pinDateAdded?: Date;
  forgotPskProcess: any;
  loading: boolean;
  loggedIn: boolean;
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
  // sensors: [],
  // loadingSensors: false,
  // sensorError: null,
};

export const userAuthReducer = createReducer(
  initialUserState,
  on(loadUser, (state) :UserState => ({
    ...state,
    loading: true,
  })),
  on(loadUserSuccess, (state, { user }) :UserState => ({
    ...state,
    user,
    loading: false,
    loggedIn: true,
  })),
  on(loadUserFailure, (state, { error }) :UserState => ({
    ...state,
    error,
    loading: false,
    loggedIn: false,
  })),
  on(loginUser, (state) :UserState => ({
    ...state,
    loading: true,
  })),
  on(loginUserSuccess, (state, { user }):UserState => ({
    ...state,
    user,
    loading: false,
    loggedIn: true,
  })),
  on(loginUserFailure, (state, { error }):UserState => ({
    ...state,
    error,
    loading: false,
    loggedIn: false,
  })),
  on(registerUser, (state) :UserState => ({
    ...state,
    loading: true,
    loggedIn: false,
  })),
  on(registerUserSuccess, (state, { user }) :UserState => ({
    ...state,
    user,
    loading: false,
    loggedIn: false,
  })),
  on(registerUserFailure, (state, { error }) :UserState => ({
    ...state,
    error,
    loading: false,
    loggedIn: false,
  })),
  on(logoutUser, (state) :UserState => ({
    ...state,
    loading: true,
    loggedIn: false,
  })),
  on(logoutUserSuccess, (state) :UserState => ({
    ...state,
    user: {
      username: '',
      email: '',
    },
    loading: false,
  })),
  on(logoutUserFailure, (state, { error }) :UserState => ({
    ...state,
    error,
    loading: false,
  })),
  on(updateUser, (state) :UserState => ({
    ...state,
    loading: true,
  })),
  on(updateUserSuccess, (state, { user }) :UserState => ({
    ...state,
    user,
    loading: false,
  })),
  on(updateUserFailure, (state, { error }) :UserState => ({
    ...state,
    error,
    loading: false,
  })),
  on(forgotUserPassword, (state) :UserState => ({
    ...state,
    forgotPskProcess: null,
    error: null,
    loading: true,
  })),
  on(forgotUserPasswordSuccess, (state, { forgotPskState }) :UserState => ({
    ...state,
    forgotPskProcess: forgotPskState,
    error: null,
    loading: false,
  })),
  on(forgotUserPasswordFailure, (state, { error }) :UserState => ({
    ...state,
    forgotPskProcess: null,
    error,
    loading: false,
  })),
  on(requestUserPin, (state) :UserState => ({
    ...state,
  })),
  on(requestUserPinSuccess, (state, { pin }) :UserState => ({
    ...state,
    pin: pin,
    pinDateAdded: new Date(),
  })),
  on(requestUserPinFailure, (state, { error }) :UserState => ({
    ...state,
    error,
  })),
  // on(requestUserSensors, (state) :UserState => ({
  //   ...state,
  //   loadingSensors: true,
  // })),
  // on(requestUserSensorsSuccess, (state, { sensors }) :UserState => ({
  //   ...state,
  //   sensors: sensors,
  //   loadingSensors: false,
  // })),
  // on(requestUserSensorsFailure, (state, { error }) :UserState => ({
  //   ...state,
  //   sensorError: error,
  //   loadingSensors: false,
  // })),
  // on(requestUserSensorLen, (state) :UserState => ({
  //   ...state,
  //   loadingSensors: true,
  // })),
  // on(requestUserSensorLenSuccess, (state, { sensorLen }) :UserState => ({
  //   ...state,
  //   sensorLen: sensorLen,
  //   loadingSensors: false,
  // })),
  // on(requestUserSensorsFailure, (state, { error }) :UserState => ({
  //   ...state,
  //   sensorError: error,
  //   loadingSensors: false,
  // })),
  // on(requestUser24HourData, (state) :UserState => ({
  //   ...state,
  //   loadingSensors: true,
  // })),
  // on(requestUser24HourDataSuccess, (state, { sensorData }) :UserState => ({
  //   ...state,
  //   sensor24HourData: sensorData,
  //   loadingSensors: false,
  // })),
  // on(requestUser24HourDataFailure, (state, { error }) :UserState => ({
  //   ...state,
  //   sensorError: error,
  //   loadingSensors: false,
  // })),
);
