import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
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
import { Store } from '@ngrx/store';
import { User } from 'src/app/interfaces/user';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

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
          catchError((error: any) => of(loginUserFailure({ error })))
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
}
