import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { ContentCache } from 'src/app/interfaces/cache/cache';
import {
  ReducerSensorData,
  SensorDetails,
  SensorReadingData,
} from 'src/app/interfaces/sensor/sensor';
import { AppState } from 'src/app/state/app.state';
import { SensorActionGroup } from 'src/app/state/sensor/sensor.actions';
import { selectSensorAll } from 'src/app/state/sensor/sensor.selector';

@Component({
  selector: 'app-collective-sensor-summery',
  templateUrl: './collective-sensor-summery.component.html',
  styleUrls: ['./collective-sensor-summery.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class CollectiveSensorSummeryComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() sensors?: SensorDetails[];
  sensorsData$?: Observable<ReducerSensorData[] | undefined>;
  averageTemperatureColor: string = 'primary';
  averageHumidityColor: string = 'primary';
  averageAlertColor: string = 'primary';

  onlineSensors: number = 0;
  offlineSensors: number = 0;
  averageTemperature: number = 0;
  averageHumidity: number = 0;
  lastAlertRecords?: {
    sensorName: string;
    singleSensorData: SensorReadingData[];
  }[];

  @ViewChild('sensorList', { static: true }) sensorList?: ElementRef;
  interval: any;

  constructor(private store: Store<AppState>) {}

  scrollToTop() {
    this.sensorList!.nativeElement.scrollTop = 0;
  }

  scrollToBottom() {
    this.sensorList!.nativeElement.scrollTop =
      this.sensorList!.nativeElement.scrollHeight;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensors']) {
      this.onlineSensors = 0;
      this.offlineSensors = 0;
      let sensorIds: number[] = [];
      this.sensors?.forEach((sensor) => {
        sensorIds.push(sensor.id as number);
        if (sensor.active) {
          this.onlineSensors++;
        } else {
          this.offlineSensors++;
        }
      });
      this.store.dispatch(
        SensorActionGroup.loadAllBasedSensorReadings({ sensorIds: sensorIds }),
      );
      this.store
        .select(selectSensorAll)
        .pipe(
          map((res: ContentCache<ReducerSensorData[]>) => {
            if (res.state != 'LOADED') return res;
            this.averageTemperature = 0;
            this.averageHumidity = 0;

            this.lastAlertRecords = undefined;
            let temperatureSum = 0;
            let humiditySum = 0;
            let entrySum = 0;
            res?.data?.forEach((sensorData) => {
              if (sensorData.sensorDataValues.length > 0) {
                temperatureSum +=
                  sensorData.sensorDataValues[
                    sensorData.sensorDataValues.length - 1
                  ].temperature;
                humiditySum +=
                  sensorData.sensorDataValues[
                    sensorData.sensorDataValues.length - 1
                  ].humidity;
                entrySum++;
              }
              if (sensorData.alertFailIndexes.length > 0) {
                let sensorLastAlertRecords: SensorReadingData[] = [];
                sensorData.alertFailIndexes.slice(-3).forEach((alertIndex) => {
                  let lastAlertRecord = sensorData.sensorDataValues[alertIndex];
                  if (lastAlertRecord) {
                    sensorLastAlertRecords.push(lastAlertRecord);
                  }
                });
                if (sensorLastAlertRecords.length > 0) {
                  if (this.lastAlertRecords) {
                    this.lastAlertRecords.push({
                      sensorName: this.sensors?.find(
                        (sensor) => sensor.id === sensorData.sensorId,
                      )?.name as string,
                      singleSensorData: sensorLastAlertRecords,
                    });
                  } else {
                    this.lastAlertRecords = [
                      {
                        sensorName: this.sensors?.find(
                          (sensor) => sensor.id === sensorData.sensorId,
                        )?.name as string,
                        singleSensorData: sensorLastAlertRecords,
                      },
                    ];
                  }
                }
                console.log(this.lastAlertRecords);
              }
            });
            this.averageTemperature =
              Math.round(
                (temperatureSum / entrySum + this.averageTemperature) * 100,
              ) / 100;
            this.averageHumidity =
              Math.round(
                (humiditySum / entrySum + this.averageTemperature) * 100,
              ) / 100;
            // if (this.averageTemperature > 30) {
            //   this.averageTemperatureColor = 'danger-high';
            // } else if (this.averageTemperature < 10) {
            //   this.averageTemperatureColor = 'danger-low';
            // } else {
            //   this.averageTemperatureColor = 'primary';
            // }
            // if (this.averageHumidity > 70) {
            //   this.averageHumidityColor = 'danger-high';
            // } else if (this.averageHumidity < 30) {
            //   this.averageHumidityColor = 'danger-low';
            // } else {
            //   this.averageHumidityColor = 'primary';
            // }
            return res;
          }),
          take(this.sensors ? this.sensors.length : 1),
        )
        .subscribe();
    }
  }

  ngOnInit() {
    this.interval = setInterval(() => {
      this.toggleWiggle();
    }, 20000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  toggleWiggle() {
    if (!this.sensorList) return;
    const element = this.sensorList.nativeElement;
    setTimeout(() => {
      element.classList.remove('wiggle');
    }, 800);
    element.classList.add('wiggle');
  }
}
