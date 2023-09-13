import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
export const globalError = createAction(
  '[Global] Failed to connect to server',
  props<{ error: HttpErrorResponse }>(),
);
