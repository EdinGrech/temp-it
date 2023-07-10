import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from './user.reducer';

export const selectUser = (state: AppState) => state.auth;

export const selectUserLoggedIn = createSelector(
  selectUser,
  (state: UserState) => state.loggedIn
);

export const selectUserLoading = createSelector(
  selectUser,
  (state: UserState) => state.loading
);

export const selectUserError = createSelector(
  selectUser,
  (state: UserState) => state.error
);

export const selectUserUser = createSelector(
  selectUser,
  (state: UserState) => state.user
);
