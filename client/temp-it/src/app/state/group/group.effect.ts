import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatest, map, mergeMap, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { GroupService } from 'src/app/services/user/group/group.service';
import { GroupActionGroup } from './group.actions';
import { GroupsSummery } from 'src/app/interfaces/group/group';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GroupEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private groupService: GroupService,
  ) {}

  getGroupsSummery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.getGroups),
      mergeMap(() =>
        this.groupService.getGroups().pipe(
          map((groups: GroupsSummery) =>
            GroupActionGroup.getGroupsSuccess({ groups }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.getGroupsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  getGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.getGroup),
      mergeMap((action) =>
        this.groupService.getGroup(action.groupId).pipe(
          map((group) =>
            GroupActionGroup.getGroupSuccess({
              group: group,
              groupId: action.groupId,
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.getGroupFailure({ groupId: action.groupId })),
          ),
        ),
      ),
    ),
  );

  createGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.createGroup),
      mergeMap((action) =>
        this.groupService.createGroup(action.group).pipe(
          map((group) => {
            this.store.dispatch(GroupActionGroup.getGroups());
            return GroupActionGroup.createGroupSuccess({ group });
          }),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.createGroupFailure(error)),
          ),
        ),
      ),
    ),
  );

  updateGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.updateGroup),
      mergeMap((action) =>
        this.groupService.updateGroup(action.groupId, action.group).pipe(
          map((group) => {
            this.store.dispatch(GroupActionGroup.getGroups());
            return GroupActionGroup.updateGroupSuccess();
          }),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.updateGroupFailure(error)),
          ),
        ),
      ),
    ),
  );

  deleteGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.deleteGroup),
      mergeMap((action) =>
        this.groupService.deleteGroup(action.groupId).pipe(
          map((group) => {
            this.store.dispatch(GroupActionGroup.getGroups());
            return GroupActionGroup.deleteGroupSuccess();
          }),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.deleteGroupFailure(error)),
          ),
        ),
      ),
    ),
  );

  addMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.addMember),
      mergeMap((action) =>
        this.groupService.addMember(action.groupId, action.username).pipe(
          map((group) => {
            this.store.dispatch(
              GroupActionGroup.getGroup({ groupId: action.groupId }),
            );
            return GroupActionGroup.addMemberSuccess();
          }),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.addMemberFailure(error)),
          ),
        ),
      ),
    ),
  );

  removeMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.removeMember),
      mergeMap((action) =>
        this.groupService.deleteMember(action.groupId, action.username).pipe(
          map((group) => {
            this.store.dispatch(
              GroupActionGroup.getGroup({ groupId: action.groupId }),
            );
            return GroupActionGroup.removeMemberSuccess();
          }),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.removeMemberFailure(error)),
          ),
        ),
      ),
    ),
  );

  addAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.addAdmin),
      mergeMap((action) =>
        this.groupService.addAdmin(action.groupId, action.username).pipe(
          map((group) => {
            this.store.dispatch(
              GroupActionGroup.getGroup({ groupId: action.groupId }),
            );
            return GroupActionGroup.addAdminSuccess();
          }),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.addAdminFailure(error)),
          ),
        ),
      ),
    ),
  );

  removeAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.removeAdmin),
      mergeMap((action) =>
        this.groupService.deleteAdmin(action.groupId, action.username).pipe(
          map((group) => {
            // this.store.dispatch(
            //   GroupActionGroup.getGroup({ groupId: action.groupId }),
            // );
            return GroupActionGroup.removeAdminSuccess();
          }),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.removeAdminFailure(error)),
          ),
        ),
      ),
    ),
  );

  addSensor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.addSensor),
      mergeMap((action) =>
        this.groupService.addSensor(action.groupId, action.sensorId).pipe(
          map((group) => {
            // this.store.dispatch(
            //   GroupActionGroup.getGroup({ groupId: action.groupId }),
            // );
            return GroupActionGroup.addSensorSuccess();
          }),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.addSensorFailure(error)),
          ),
        ),
      ),
    ),
  );

  removeSensor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActionGroup.removeSensor),
      mergeMap((action) =>
        this.groupService.deleteSensor(action.groupId, action.sensorId).pipe(
          map((group) => {
            // this.store.dispatch(
            //   GroupActionGroup.getGroup({ groupId: action.groupId }),
            // );
            return GroupActionGroup.removeSensorSuccess();
          }),
          catchError((error: HttpErrorResponse) =>
            of(GroupActionGroup.removeSensorFailure(error)),
          ),
        ),
      ),
    ),
  );
}
