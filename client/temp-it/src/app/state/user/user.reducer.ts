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
} from './user.actions';

export interface UserState {
  user: User;
  error: any;
  loading: boolean;
  loggedIn: boolean;
}

export const initialState: UserState = {
  user: {
    username: '',
    email: '',
    news_tollerance: 0,
  },
  error: null,
  loading: false,
  loggedIn: false,
};

export const userAuthReducer = createReducer(
  initialState,
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
      news_tollerance: 0,
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
  }))
);
