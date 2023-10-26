import { createReducer, on, createFeature } from '@ngrx/store';
import {
  ContentCache,
  CacheContentState,
} from 'src/app/interfaces/cache/cache';
import {
  Group,
  GroupBaseIdentifier,
  GroupsSummery,
} from 'src/app/interfaces/group/group';
import { RequestState } from 'src/app/interfaces/state-tracker/state-tracker';
import { initialContentCache } from 'src/app/utils/cacheStoreHelpers';
import { GroupActionGroup } from './group.actions';

export interface GroupState {
  groupsSummery: ContentCache<GroupsSummery>;
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
  groupsSummery: initialContentCache,
};

export const groupReducer = createReducer(
  initialGroupState,
  // ! GROUP GETTERS
  on(GroupActionGroup.getGroups, (state): GroupState => {
    return {
      ...state,
      groupsSummery: {
        state: 'LOADING' as CacheContentState,
      },
    };
  }),
  on(GroupActionGroup.getGroupsSuccess, (state, { groups }): GroupState => {
    return {
      ...state,
      groupsSummery: {
        state: 'LOADED' as CacheContentState,
        data: groups,
      },
    };
  }),
  on(GroupActionGroup.getGroupsFailure, (state, { error }): GroupState => {
    return {
      ...state,
      groupsSummery: {
        state: 'ERROR' as CacheContentState,
        message: error,
      },
    };
  }),
  // ! SINGLE GROUP GETTERS
  on(GroupActionGroup.getGroup, (state, { groupId }): GroupState => {
    const detailGroups = [...state.detailGroups || []];
    detailGroups.push({
      [groupId]: {
        state: 'LOADING' as CacheContentState,
      },
    });
    return {
      ...state,
      detailGroups,
    };
  }),
  on(
    GroupActionGroup.getGroupSuccess,
    (state, { group, groupId }): GroupState => {
      const detailGroups = (state.detailGroups || []).map((detailGroup) => {
        if (detailGroup[groupId]) {
          return {
            [groupId]: {
              state: 'LOADED' as CacheContentState,
              data: group,
            },
          };
        }
        return detailGroup;
      });
      return {
        ...state,
        detailGroups,
      };
    },
  ),
  on(GroupActionGroup.getGroupFailure, (state, { groupId }): GroupState => {
    const detailGroups = (state.detailGroups || []).map((detailGroup) => {
      if (detailGroup[groupId]) {
        return {
          [groupId]: {
            state: 'ERROR' as CacheContentState,
          },
        };
      }
      return detailGroup;
    });
    return {
      ...state,
      detailGroups,
    };
  }),
  // ! GROUP ACTIONS
  on(GroupActionGroup.createGroup, (state, { group }): GroupState => {
    return {
      ...state,
      groupActions: {
        createGroup: {
          state: 'LOADING' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.createGroupSuccess, (state, { group }): GroupState => {
    return {
      ...state,
      groupActions: {
        createGroup: {
          state: 'LOADED' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.createGroupFailure, (state): GroupState => {
    return {
      ...state,
      groupActions: {
        createGroup: {
          state: 'ERROR' as CacheContentState,
        },
      },
    };
  }),
  // ********** UPDATE GROUP **********
  on(GroupActionGroup.updateGroup, (state, { groupId, group }): GroupState => {
    return {
      ...state,
      groupActions: {
        updateGroup: {
          state: 'LOADING' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.updateGroupSuccess, (state): GroupState => {
    return {
      ...state,
      groupActions: {
        updateGroup: {
          state: 'LOADED' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.updateGroupFailure, (state): GroupState => {
    return {
      ...state,
      groupActions: {
        updateGroup: {
          state: 'ERROR' as CacheContentState,
        },
      },
    };
  }),
  // ********** DELETE GROUP **********
  on(GroupActionGroup.deleteGroup, (state, { groupId }): GroupState => {
    return {
      ...state,
      groupActions: {
        deleteGroup: {
          state: 'LOADING' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.deleteGroupSuccess, (state): GroupState => {
    return {
      ...state,
      groupActions: {
        deleteGroup: {
          state: 'LOADED' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.deleteGroupFailure, (state): GroupState => {
    return {
      ...state,
      groupActions: {
        deleteGroup: {
          state: 'ERROR' as CacheContentState,
        },
      },
    };
  }),
  // ! ADMIN ACTIONS
  on(GroupActionGroup.addAdmin, (state, { groupId, username }): GroupState => {
    return {
      ...state,
      adminActions: {
        addAdmin: {
          state: 'LOADING' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.addAdminSuccess, (state): GroupState => {
    return {
      ...state,
      adminActions: {
        addAdmin: {
          state: 'LOADED' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.addAdminFailure, (state): GroupState => {
    return {
      ...state,
      adminActions: {
        addAdmin: {
          state: 'ERROR' as CacheContentState,
        },
      },
    };
  }),
  // ********** REMOVE ADMIN **********
  on(
    GroupActionGroup.removeAdmin,
    (state, { groupId, username }): GroupState => {
      return {
        ...state,
        adminActions: {
          removeAdmin: {
            state: 'LOADING' as CacheContentState,
          },
        },
      };
    },
  ),
  on(GroupActionGroup.removeAdminSuccess, (state): GroupState => {
    return {
      ...state,
      adminActions: {
        removeAdmin: {
          state: 'LOADED' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.removeAdminFailure, (state): GroupState => {
    return {
      ...state,
      adminActions: {
        removeAdmin: {
          state: 'ERROR' as CacheContentState,
        },
      },
    };
  }),
  // ! MEMBER ACTIONS
  on(GroupActionGroup.addMember, (state, { groupId, username }): GroupState => {
    return {
      ...state,
      memberActions: {
        addGroupMember: {
          state: 'LOADING' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.addMemberSuccess, (state): GroupState => {
    return {
      ...state,
      memberActions: {
        addGroupMember: {
          state: 'LOADED' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.addMemberFailure, (state): GroupState => {
    return {
      ...state,
      memberActions: {
        addGroupMember: {
          state: 'ERROR' as CacheContentState,
        },
      },
    };
  }),
  // ********** REMOVE MEMBER **********
  on(
    GroupActionGroup.removeMember,
    (state, { groupId, username }): GroupState => {
      return {
        ...state,
        memberActions: {
          removeGroupMember: {
            state: 'LOADING' as CacheContentState,
          },
        },
      };
    },
  ),
  on(GroupActionGroup.removeMemberSuccess, (state): GroupState => {
    return {
      ...state,
      memberActions: {
        removeGroupMember: {
          state: 'LOADED' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.removeMemberFailure, (state): GroupState => {
    return {
      ...state,
      memberActions: {
        removeGroupMember: {
          state: 'ERROR' as CacheContentState,
        },
      },
    };
  }),

  // ! SENSOR ACTIONS
  on(GroupActionGroup.addSensor, (state, { groupId, sensorId }): GroupState => {
    return {
      ...state,
      sensorActions: {
        addGroupSensor: {
          state: 'LOADING' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.addSensorSuccess, (state): GroupState => {
    return {
      ...state,
      sensorActions: {
        addGroupSensor: {
          state: 'LOADED' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.addSensorFailure, (state): GroupState => {
    return {
      ...state,
      sensorActions: {
        addGroupSensor: {
          state: 'ERROR' as CacheContentState,
        },
      },
    };
  }),
  // ********** REMOVE SENSOR **********
  on(
    GroupActionGroup.removeSensor,
    (state, { groupId, sensorId }): GroupState => {
      return {
        ...state,
        sensorActions: {
          removeGroupSensor: {
            state: 'LOADING' as CacheContentState,
          },
        },
      };
    },
  ),
  on(GroupActionGroup.removeSensorSuccess, (state): GroupState => {
    return {
      ...state,
      sensorActions: {
        removeGroupSensor: {
          state: 'LOADED' as CacheContentState,
        },
      },
    };
  }),
  on(GroupActionGroup.removeSensorFailure, (state): GroupState => {
    return {
      ...state,
      sensorActions: {
        removeGroupSensor: {
          state: 'ERROR' as CacheContentState,
        },
      },
    };
  }),
);
