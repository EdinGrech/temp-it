import { createReducer, on, createFeature } from '@ngrx/store';
import { globalError } from './global.actions';

export interface GlobalState {
  error: any;
}

export const initialGlobalState: GlobalState = {
  error: null,
};

export const globeReducer = createReducer(
  initialGlobalState,
  on(globalError, (state, { error }) => ({
    ...state,
    error,
  })),
);
