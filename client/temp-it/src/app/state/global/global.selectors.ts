import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { GlobalState } from './global.reducer';

export const selectGlobal = (state: AppState) => state.global;

export const selectGlobalError = createSelector(
  selectGlobal,
  (state: GlobalState) => state.error,
);
