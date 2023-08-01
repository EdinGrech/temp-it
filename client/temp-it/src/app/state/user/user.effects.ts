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
  forgotUserPassword,
  forgotUserPasswordSuccess,
  forgotUserPasswordFailure,
  requestUserPin,
  requestUserPinFailure,
  requestUserPinSuccess,
} from './user.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { PinService } from 'src/app/services/user/pin/pin.service';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private authService: AuthService, private pinService: PinService) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      mergeMap(() =>
        this.authService.getUser().pipe(
          map((user: any) => loadUserSuccess({ user: user })),
          catchError((error) => of(loadUserFailure({ error })))
        )
      )
    )
  );

  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUser),
      mergeMap((action) =>
        this.authService.signInWithEmail(action.email, action.password).pipe(
          map((user: any) => loginUserSuccess({ user })),
          catchError((error: HttpErrorResponse) => of(loginUserFailure({ error })))
        )
      )
    )
  );

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      mergeMap((action) =>
        this.authService
          .signUp(action.username, action.email, action.password)
          .pipe(
            map((user: any) => registerUserSuccess({ user })),
            catchError((error: any) => of(registerUserFailure({ error })))
          )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mergeMap((action) =>
        this.authService.updateUser(action.user).pipe(
          map((user: any) => updateUserSuccess({ user })),
          catchError((error: any) => of(updateUserFailure({ error })))
        )
      )
    )
  );

  logoutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutUser),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => logoutUserSuccess()),
          catchError((error: any) => of(logoutUserFailure({ error })))
        )
      )
    )
  );

  forgotUserPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forgotUserPassword),
      mergeMap((action) =>
        this.authService.forgotPassword(action.email).pipe(
          map((forgotPskState: any) => forgotUserPasswordSuccess({ forgotPskState })),
          catchError((error: any) => of(forgotUserPasswordFailure({ error })))
        )
      )
    )
  );

  requestUserPin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestUserPin),
      mergeMap(() =>
        this.pinService.getUserPin().pipe(
          map((pin: number) => requestUserPinSuccess({ pin })),
          catchError((error: any) => of(requestUserPinFailure({ error })))
        )
      )
    )
  );
}
