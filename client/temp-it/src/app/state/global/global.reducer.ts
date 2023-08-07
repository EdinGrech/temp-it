import { createReducer, on, createFeature } from '@ngrx/store';
import { globalError } from './global.actions';

export interface GlobalState {
  error: any;
}

export const initialState: GlobalState = {
  error: null,
};

export const globeReducer = createReducer(
  initialState,
  on(globalError, (state, { error }) => ({
    ...state,
    error,
  })),
);
