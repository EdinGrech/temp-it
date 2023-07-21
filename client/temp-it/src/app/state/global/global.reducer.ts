import { createReducer, on, createFeature } from '@ngrx/store';
import { connectionRefuse } from './global.actions';

export interface GlobalState {
  error: any;
}

export const initialState: GlobalState = {
  error: null,
};

export const globeReduer = createReducer(
  initialState,
  on(connectionRefuse, (state, { error }) => ({
    ...state,
    error,
  })),
);
