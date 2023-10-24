import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectSensor = (state: AppState) => state.sensor;

export const selectSensorAll = createSelector(
  selectSensor,
  (state) => state.sensors,
);

export const selectSensorData = (id: number) =>
  createSelector(selectSensor, (state) =>
    state.sensors.find((s) => s.sensorId === id),
  );

export const selectSensorDataValues = (id: number) =>
  createSelector(selectSensorData(id), (state) => state?.sensorDataValues);

export const selectSensorAlertFailIndexes = (id: number) =>
  createSelector(selectSensorData(id), (state) => state?.alertFailIndexes);

export const selectSensorAlertsIncreasing = (id: number) =>
  createSelector(selectSensorData(id), (state) => state?.alertsIncreasing);
