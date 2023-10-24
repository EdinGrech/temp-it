import { createReducer, on, createFeature } from '@ngrx/store';
import { ContentCache } from 'src/app/interfaces/cache/cache';
import { Group, GroupBaseIdentifier } from 'src/app/interfaces/group/group';
import { RequestState } from 'src/app/interfaces/state-tracker/state-tracker';
import { initialContentCache } from 'src/app/utils/cacheStoreHelpers';

export interface GroupState {
  groupsSummery: ContentCache<GroupBaseIdentifier>[];
  detailGroups?: { [groupId: string]: ContentCache<Group> }[];
  groupActions?: {
    createGroup?: RequestState;
    updateGroup?: RequestState;
    deleteGroup?: RequestState;
  };
  adminActions?: {
    addAdmin?: RequestState;
    removeAdmin?: RequestState;
  };
  memberActions?: {
    addGroupMember?: RequestState;
    removeGroupMember?: RequestState;
  };
  sensorActions?: {
    addGroupSensor?: RequestState;
    removeGroupSensor?: RequestState;
  };
}

export const initialGroupState: GroupState = {
  groupsSummery: [],
};

export const sensorReducer = createReducer(initialGroupState);
