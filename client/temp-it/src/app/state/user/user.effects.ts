import { Injectable } from '@angular/core';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import {
  loadUser,
  loadUserFailure,
  loadUserSuccess,
  loginUser,
  loginUserFailure,
  loginUserSuccess,
  registerUser,
  registerUserFailure,
  registerUserSuccess,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  logoutUser,
  logoutUserSuccess,
  logoutUserFailure,
} from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      mergeMap(() =>
        this.authService.getUser().pipe(
          map((user: any) => loadUserSuccess({ user: user })),
          catchError((error) => of(loadUserFailure({ error }))),
        ),
      ),
    ),
  );

  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUser),
      mergeMap((action) =>
        this.authService.signInWithEmail(action.email, action.password).pipe(
          map((user: any) => loginUserSuccess({ user })),
          catchError((error: any) => of(loginUserFailure({ error }))),
        ),
      ),
    ),
  );

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      mergeMap((action) =>
        this.authService
          .signUp(action.username, action.email, action.password)
          .pipe(
            map((user: any) => registerUserSuccess({ user })),
            catchError((error: any) => of(registerUserFailure({ error }))),
          ),
      ),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mergeMap((action) =>
        this.authService.updateUser(action.user).pipe(
          map((user: any) => updateUserSuccess({ user })),
          catchError((error: any) => of(updateUserFailure({ error }))),
        ),
      ),
    ),
  );

  logoutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutUser),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => logoutUserSuccess()),
          catchError((error: any) => of(logoutUserFailure({ error }))),
        ),
      ),
    ),
  );
}
