import { createAction, props } from '@ngrx/store';
import {
  SensorDetails,
  SensorReadingData,
} from 'src/app/interfaces/sensor/sensor';

export const SensorActionGroup = {
  loadAllBasedSensorReadings: createAction(
    '[Sensor] Load All Based Sensor Readings',
    props<{ sensorIds: number[] }>(),
  ),

  loadDateBasedSensorReadings: createAction(
    '[Sensor] Load Last 24 Hour Sensor Readings',
    props<{ sensorId: number }>(),
  ),

  loadDateBasedSensorReadingsSuccess: createAction(
    '[Sensor] Load Last 24 Hour Sensor Readings Success',
    props<{
      sensorDataValues: SensorReadingData[];
      sensorId: number;
      alertFailIndexes: number[];
      alertsIncreasing: boolean;
    }>(),
  ),
  loadDateBasedSensorReadingsFailure: createAction(
    '[Sensor] Load Last 24 Hour Sensor Readings Failure',
    props<{ error: any }>(),
  ),
  requestSensorsSummary: createAction('[Sensor] Request User Sensors'),
  requestSensorsSummarySuccess: createAction(
    '[Sensor] Request User Sensors Success',
    props<{ sensors: SensorDetails[] }>(),
  ),
  requestSensorsSummaryFailure: createAction(
    '[Sensor] Request User Sensors Failure',
    props<{ error: any }>(),
  ),
  requestSensorListLen: createAction('[Sensor] Request User Sensor Len'),
  requestSensorListLenSuccess: createAction(
    '[Sensor] Request User Sensor Len Success',
    props<{ sensorLen: number }>(),
  ),
  requestSensorListLenFailure: createAction(
    '[Sensor] Request User Sensor Len Failure',
    props<{ error: any }>(),
  ),
  request24HourSensorData: createAction(
    '[Sensor] Request User 24 Hour Data',
    props<{ sensorId: number }>(),
  ),
  request24HourSensorDataSuccess: createAction(
    '[Sensor] Request User 24 Hour Data Success',
    props<{ sensorData: SensorReadingData[] }>(),
  ),
  request24HourSensorDataFailure: createAction(
    '[Sensor] Request User 24 Hour Data Failure',
    props<{ error: any }>(),
  ),
};
