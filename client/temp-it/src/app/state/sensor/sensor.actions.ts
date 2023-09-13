import { createAction, props } from '@ngrx/store';
import { singleSensorData } from 'src/app/interfaces/sensor/sensor';

export const loadDateBasedSensorReadings = createAction(
  '[Sensor] Load Last 24 Hour Sensor Readings',
  props<{ sensorId: number }>(),
);

export const loadDateBasedSensorReadingsSuccess = createAction(
  '[Sensor] Load Last 24 Hour Sensor Readings Success',
  props<{
    sensorDataValues: singleSensorData[];
    sensorId: number;
    alertFailIndexes: number[];
    alertsIncreasing: boolean;
  }>(),
);

export const loadDateBasedSensorReadingsFailure = createAction(
  '[Sensor] Load Last 24 Hour Sensor Readings Failure',
  props<{ error: any }>(),
);
