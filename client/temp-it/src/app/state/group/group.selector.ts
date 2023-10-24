import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectGroup = (state: AppState) => state.group;

export const GroupSummery = createSelector(
  selectGroup,
  (state) => state.groupsSummery,
);

export const Group = (id: number) =>
  createSelector(selectGroup, (state) => {
    if (!state.detailGroups) return null;
    return state.detailGroups[id];
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
