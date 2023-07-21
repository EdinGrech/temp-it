import { createAction, props } from '@ngrx/store';
export const connectionRefuse = createAction(
  '[Global] Failed to connect to server',
  props<{ error: any }>(),
);