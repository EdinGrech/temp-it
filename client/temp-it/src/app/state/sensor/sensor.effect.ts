import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatest, map, mergeMap, of, switchMap } from 'rxjs';
import { SensorService } from 'src/app/services/user/sensor/sensor.service';
import { SensorActionGroup } from './sensor.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import {
  SensorDetails,
  SensorReadingData,
} from 'src/app/interfaces/sensor/sensor';
import { selectSensorSummary } from './sensor.selector';

@Injectable()
export class SensorEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private sensorService: SensorService,
  ) {}

  loadDateBasedSensorReadings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SensorActionGroup.loadDateBasedSensorReadings),
      mergeMap((action) =>
        combineLatest([
          this.store.select(selectSensorSummary(action.sensorId)),
          this.sensorService.getSensorLast24Hours(action.sensorId),
        ]).pipe(
          map(([sensorDetails, sensorDataValues]) =>
            this.alertProcessing(sensorDataValues, sensorDetails),
          ),
          map((result) =>
            SensorActionGroup.loadDateBasedSensorReadingsSuccess({
              sensorDataValues: result.sensorDataValues,
              sensorId: action.sensorId,
              alertFailIndexes: result.alertFailIndexes,
              alertsIncreasing: result.alertsIncreasing,
            }),
          ),
          catchError((error) =>
            of(SensorActionGroup.loadDateBasedSensorReadingsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  loadAllBasedSensorReadings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SensorActionGroup.loadAllBasedSensorReadings),
        mergeMap((action) =>
          action.sensorIds.map((sensorId) =>
            this.store.dispatch(
              SensorActionGroup.loadDateBasedSensorReadings({ sensorId }),
            ),
          ),
        ),
      ),
    { dispatch: false },
  );

  alertProcessing(
    sensorDataValues: SensorReadingData[],
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

  requestUserSensors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SensorActionGroup.requestSensorsSummary),
      mergeMap(() =>
        this.sensorService.getUserSensors().pipe(
          map((sensors: SensorDetails[]) =>
            SensorActionGroup.requestSensorsSummarySuccess({ sensors }),
          ),
          catchError((error: any) =>
            of(SensorActionGroup.requestSensorsSummaryFailure({ error })),
          ),
        ),
      ),
    ),
  );

  requestUserSensorLen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SensorActionGroup.requestSensorListLen),
      mergeMap(() =>
        this.sensorService.getUserSensorsCount().pipe(
          map((sensorLen: number) =>
            SensorActionGroup.requestSensorListLenSuccess({ sensorLen }),
          ),
          catchError((error: any) =>
            of(SensorActionGroup.requestSensorListLenFailure({ error })),
          ),
        ),
      ),
    ),
  );

  requestUser24HourData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SensorActionGroup.request24HourSensorData),
      mergeMap((action) =>
        this.sensorService.getSensorLast24Hours(action.sensorId).pipe(
          map((sensorData: SensorReadingData[]) =>
            SensorActionGroup.request24HourSensorDataSuccess({ sensorData }),
          ),
          catchError((error: any) =>
            of(SensorActionGroup.request24HourSensorDataFailure({ error })),
          ),
        ),
      ),
    ),
  );
}
