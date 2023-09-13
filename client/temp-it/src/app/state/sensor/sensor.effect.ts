import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatest, map, mergeMap, of } from 'rxjs';
import { SensorService } from 'src/app/services/user/sensor/sensor.service';
import {
  loadDateBasedSensorReadings,
  loadDateBasedSensorReadingsFailure,
  loadDateBasedSensorReadingsSuccess,
} from './sensor.actions';
import { selectUserSensor } from '../user/user.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import {
  SensorDetails,
  singleSensorData,
} from 'src/app/interfaces/sensor/sensor';

@Injectable()
export class SensorEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private sensorService: SensorService,
  ) {}

  loadDateBasedSensorReadings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDateBasedSensorReadings),
      mergeMap((action) =>
        combineLatest([
          this.store.select(selectUserSensor(action.sensorId)),
          this.sensorService.getSensorLast24Hours(action.sensorId),
        ]).pipe(
          map(([sensorDetails, sensorDataValues]) =>
            this.alertProcessing(sensorDataValues, sensorDetails),
          ),
          map((result) =>
            loadDateBasedSensorReadingsSuccess({
              sensorDataValues: result.sensorDataValues,
              sensorId: action.sensorId,
              alertFailIndexes: result.alertFailIndexes,
              alertsIncreasing: result.alertsIncreasing,
            }),
          ),
          catchError((error) =>
            of(loadDateBasedSensorReadingsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  alertProcessing(
    sensorDataValues: singleSensorData[],
    sensorDetails: SensorDetails | undefined,
  ) {
    let alertFailIndexes: number[] = [];
    if (sensorDetails?.active_alerts) {
      const midpoint = Math.floor(sensorDataValues.length / 2);
      let underCounter = 0;
      sensorDataValues.forEach((sensorDataValue, index) => {
        if (
          sensorDataValue.temperature >= sensorDetails.high_temp_alert! ||
          sensorDataValue.temperature < sensorDetails.low_temp_alert! ||
          sensorDataValue.humidity >= sensorDetails.high_humidity_alert! ||
          sensorDataValue.humidity < sensorDetails.low_humidity_alert!
        ) {
          alertFailIndexes.push(index);
          if (index < midpoint) {
            underCounter++;
          }
        }
      });
      let alertsIncreasing = true;
      if (underCounter > alertFailIndexes.length / 2) {
        alertsIncreasing = false;
      } else {
        alertsIncreasing = true;
      }
      return { sensorDataValues, alertFailIndexes, alertsIncreasing };
    } else {
      return { sensorDataValues, alertFailIndexes, alertsIncreasing: false };
    }
  }
}
