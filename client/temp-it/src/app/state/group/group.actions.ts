import { createAction, props } from '@ngrx/store';
import {
  Group,
  GroupBase,
  GroupBaseIdentifier,
  GroupsSummery,
} from 'src/app/interfaces/group/group';
// organize actions into a single object

export const GroupActionGroup = {
  getGroups: createAction('[Group] Get Groups'),
  getGroupsSuccess: createAction(
    '[Group] Get Groups Success',
    props<{ groups: GroupsSummery }>(),
  ),
  getGroupsFailure: createAction(
    '[Group] Get Groups Failure',
    props<{ error: any }>(),
  ),

  getGroup: createAction('[Group] Get Group', props<{ groupId: string }>()),
  getGroupSuccess: createAction(
    '[Group] Get Group Success',
    props<{ group: Group; groupId: string }>(),
  ),
  getGroupFailure: createAction(
    '[Group] Get Group Failure',
    props<{ groupId: string }>(),
  ),

  createGroup: createAction(
    '[Group] Create Group',
    props<{ group: GroupBase }>(),
  ),
  createGroupSuccess: createAction(
    '[Group] Create Group Success',
    props<{ group: GroupBase }>(),
  ),
  createGroupFailure: createAction(
    '[Group] Create Group Failure',
    props<{ error: any }>(),
  ),

  updateGroup: createAction(
    '[Group] Update Group',
    props<{ groupId: string; group: GroupBase }>(),
  ),
  updateGroupSuccess: createAction('[Group] Update Group Success'),
  updateGroupFailure: createAction(
    '[Group] Update Group Failure',
    props<{ error: any }>(),
  ),
  deleteGroup: createAction(
    '[Group] Delete Group',
    props<{ groupId: string }>(),
  ),
  deleteGroupSuccess: createAction('[Group] Delete Group Success'),
  deleteGroupFailure: createAction(
    '[Group] Delete Group Failure',
    props<{ error: any }>(),
  ),

  addAdmin: createAction(
    '[Group] Add Admin',
    props<{ groupId: string; username: string }>(),
  ),
  addAdminSuccess: createAction('[Group] Add Admin Success'),
  addAdminFailure: createAction(
    '[Group] Add Admin Failure',
    props<{ error: any }>(),
  ),

  removeAdmin: createAction(
    '[Group] Remove Admin',
    props<{ groupId: string; username: string }>(),
  ),
  removeAdminSuccess: createAction('[Group] Remove Admin Success'),
  removeAdminFailure: createAction(
    '[Group] Remove Admin Failure',
    props<{ error: any }>(),
  ),

  addMember: createAction(
    '[Group] Add Member',
    props<{ groupId: string; username: string }>(),
  ),
  addMemberSuccess: createAction('[Group] Add Member Success'),
  addMemberFailure: createAction(
    '[Group] Add Member Failure',
    props<{ error: any }>(),
  ),

  removeMember: createAction(
    '[Group] Remove Member',
    props<{ groupId: string; username: string }>(),
  ),
  removeMemberSuccess: createAction('[Group] Remove Member Success'),
  removeMemberFailure: createAction(
    '[Group] Remove Member Failure',
    props<{ error: any }>(),
  ),

  addSensor: createAction(
    '[Group] Add Sensor',
    props<{ groupId: string; sensorId: number }>(),
  ),
  addSensorSuccess: createAction('[Group] Add Sensor Success'),
  addSensorFailure: createAction(
    '[Group] Add Sensor Failure',
    props<{ error: any }>(),
  ),

  removeSensor: createAction(
    '[Group] Remove Sensor',
    props<{ groupId: string; sensorId: number }>(),
  ),
  removeSensorSuccess: createAction('[Group] Remove Sensor Success'),
  removeSensorFailure: createAction(
    '[Group] Remove Sensor Failure',
    props<{ error: any }>(),
  ),
};
