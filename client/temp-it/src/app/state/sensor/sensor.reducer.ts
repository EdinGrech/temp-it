import { createReducer, on, createFeature } from '@ngrx/store';
import {
  ReducerSensorData,
  SensorDetails,
  SensorReadingData,
} from 'src/app/interfaces/sensor/sensor';
import { SensorActionGroup } from './sensor.actions';
import { ContentCache } from 'src/app/interfaces/cache/cache';
import { initialContentCache } from 'src/app/utils/cacheStoreHelpers';

export interface SensorState {
  sensorDataValues?: ContentCache<SensorReadingData[]>;
  sensors_summery: ContentCache<SensorDetails[]>;
  sensorLen?: number;
  sensor24HourData?: ContentCache<SensorReadingData[]>;
  sensors: ContentCache<
    {
      sensorId: number;
      sensorDataValues: SensorReadingData[];
      alertFailIndexes: number[];
      alertsIncreasing: boolean;
    }[]
  >;
}

export const initialSensorState: SensorState = {
  sensors_summery: initialContentCache,
  sensors: initialContentCache,
};

export const sensorReducer = createReducer(
  initialSensorState,
  on(
    SensorActionGroup.loadDateBasedSensorReadings,
    (state): SensorState => ({
      ...state,
      sensorDataValues: {
        state: 'LOADING',
      },
    }),
  ),
  on(
    SensorActionGroup.loadDateBasedSensorReadingsSuccess,
    (
      state,
      { sensorDataValues, sensorId, alertFailIndexes, alertsIncreasing },
    ): SensorState => {
      let sensors = [...(state.sensors.data || [])].map((sensor) =>
        sensor.sensorId === sensorId
          ? ({
              ...sensor,
              sensorDataValues,
              alertFailIndexes,
              alertsIncreasing,
            } as ReducerSensorData)
          : sensor,
      );

      return {
        ...state,
        sensors: {
          state: 'LOADED',
          data: sensors,
        },
      };
    },
  ),
  on(
    SensorActionGroup.loadDateBasedSensorReadingsFailure,
    (state, { error }): SensorState => ({
      ...state,
      sensorDataValues: {
        state: 'ERROR',
        error,
      },
    }),
  ),
  on(
    SensorActionGroup.requestSensorsSummary,
    (state): SensorState => ({
      ...state,
      sensors_summery: {
        state: 'LOADING',
      },
    }),
  ),
  on(
    SensorActionGroup.requestSensorsSummarySuccess,
    (state, { sensors }): SensorState => ({
      ...state,
      sensors_summery: {
        state: 'LOADED',
        data: sensors,
      },
    }),
  ),
  on(
    SensorActionGroup.requestSensorsSummaryFailure,
    (state, { error }): SensorState => ({
      ...state,
      sensors_summery: {
        state: 'ERROR',
        error,
      },
    }),
  ),
  on(
    SensorActionGroup.requestSensorListLen,
    (state): SensorState => ({
      ...state,
    }),
  ),
  on(
    SensorActionGroup.requestSensorListLenSuccess,
    (state, { sensorLen }): SensorState => ({
      ...state,
      sensorLen: sensorLen,
    }),
  ),
  on(
    SensorActionGroup.requestSensorsSummaryFailure,
    (state, { error }): SensorState => ({
      ...state,
    }),
  ),
  on(
    SensorActionGroup.request24HourSensorData,
    (state): SensorState => ({
      ...state,
      sensor24HourData: {
        state: 'LOADING',
      },
    }),
  ),
  on(
    SensorActionGroup.request24HourSensorDataSuccess,
    (state, { sensorData }): SensorState => ({
      ...state,
      sensor24HourData: {
        state: 'LOADED',
        data: sensorData,
      },
    }),
  ),
  on(
    SensorActionGroup.request24HourSensorDataFailure,
    (state, { error }): SensorState => ({
      ...state,
      sensor24HourData: {
        state: 'ERROR',
        error,
      },
    }),
  ),
);
