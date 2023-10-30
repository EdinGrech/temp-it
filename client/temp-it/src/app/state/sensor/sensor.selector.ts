import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectSensor = (state: AppState) => state.sensor;

export const selectSensorAll = createSelector(
  selectSensor,
  (state) => state.sensors,
);

export const selectSensorData = (id: number) =>
  createSelector(
    selectSensor,
    (state) => state.sensors.data?.find((s) => s.sensorId === id),
  );

export const selectSensorDataValues = (id: number) =>
  createSelector(selectSensorData(id), (state) => state?.sensorDataValues);

export const selectSensorAlertFailIndexes = (id: number) =>
  createSelector(selectSensorData(id), (state) => state?.alertFailIndexes);

export const selectSensorAlertsIncreasing = (id: number) =>
  createSelector(selectSensorData(id), (state) => state?.alertsIncreasing);

export const selectSensorsSummary = createSelector(
  selectSensor,
  (state) => state.sensors_summery,
);

export const selectSensorSummary = (id: number) =>
  createSelector(
    selectSensorsSummary,
    (data) => data.data?.find((s) => s.id === id),
  );
