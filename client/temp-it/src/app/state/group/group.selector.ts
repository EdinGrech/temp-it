import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { Group as GroupInterface } from 'src/app/interfaces/group/group';
import { ContentCache } from 'src/app/interfaces/cache/cache';

export const selectGroup = (state: AppState) => state.group;

export const GroupSummery = createSelector(
  selectGroup,
  (state) => state.groupsSummery,
);

export const Group = (id: number) =>
  createSelector(selectGroup, (state):null|ContentCache<GroupInterface> => {
    if (!state.detailGroups) return null;
    return state.detailGroups[id][id];   
  });

export const GroupActions = createSelector(
  selectGroup,
  (state) => state.groupActions,
);

export const AdminActions = createSelector(
  selectGroup,
  (state) => state.adminActions,
);

export const MemberActions = createSelector(
  selectGroup,
  (state) => state.memberActions,
);

export const SensorActions = createSelector(
  selectGroup,
  (state) => state.sensorActions,
);
