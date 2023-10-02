import { createReducer, on, createFeature } from '@ngrx/store';
import { singleSensorData } from 'src/app/interfaces/sensor/sensor';
import {
  loadDateBasedSensorReadings,
  loadDateBasedSensorReadingsFailure,
  loadDateBasedSensorReadingsSuccess,
} from './sensor.actions';

export interface SensorState {
  sensors: {
    sensorId: number;
    sensorDataValues: singleSensorData[];
    alertFailIndexes: number[];
    alertsIncreasing: boolean;
    error: any;
    loading: boolean;
  }[];
}

export const initialSensorState: SensorState = {
  sensors: [],
};

export const sensorReducer = createReducer(
  initialSensorState,
  on(loadDateBasedSensorReadings, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    loadDateBasedSensorReadingsSuccess,
    (
      state,
      { sensorDataValues, sensorId, alertFailIndexes, alertsIncreasing },
    ) => ({
      ...state,
      sensors: state.sensors.map((sensor) =>
        sensor.sensorId === sensorId
          ? {
              ...sensor,
              sensorDataValues,
              alertFailIndexes,
              alertsIncreasing,
              error: null,
              loading: false,
            }
          : sensor,
      ),
      ...(state.sensors.some((sensor) => sensor.sensorId === sensorId)
        ? {}
        : {
            sensors: [
              ...state.sensors,
              {
                sensorId,
                sensorDataValues,
                alertFailIndexes,
                alertsIncreasing,
                error: null,
                loading: false,
              },
            ],
          }),
    }),
  ),
  on(loadDateBasedSensorReadingsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
);
