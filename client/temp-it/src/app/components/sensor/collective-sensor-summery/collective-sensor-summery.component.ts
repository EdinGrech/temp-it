import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import {
  ReducerSensorData,
  SensorDetails,
  singleSensorData,
} from 'src/app/interfaces/sensor/sensor';
import { AppState } from 'src/app/state/app.state';
import { loadAllBasedSensorReadings } from 'src/app/state/sensor/sensor.actions';
import { selectSensorAll } from 'src/app/state/sensor/sensor.selector';

@Component({
  selector: 'app-collective-sensor-summery',
  templateUrl: './collective-sensor-summery.component.html',
  styleUrls: ['./collective-sensor-summery.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class CollectiveSensorSummeryComponent implements OnInit, OnChanges {
  @Input() sensors?: SensorDetails[];
  sensorsData$?: Observable<ReducerSensorData[] | undefined>;
  averageTemperatureColor: string = 'primary';
  averageHumidityColor: string = 'primary';
  averageAlertColor: string = 'primary';

  onlineSensors: number = 0;
  offlineSensors: number = 0;

  averageTemperature: number = 0;
  averageHumidity: number = 0;

  lastAlertRecords?: singleSensorData[];

  constructor(private store: Store<AppState>) {
    this.sensorsData$ = this.store.select(selectSensorAll).pipe(
      map((res:ReducerSensorData[]) => {
        if (!this.sensors) return res;
        let temperatureSum = 0;
        let humiditySum = 0;
        let entrySum = 0;
        res?.forEach((sensorData) => {
          if (
            this.sensors?.find((sensor) => sensor.id === sensorData.sensorId)
          ) {
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
          }
        });
        this.averageTemperature = temperatureSum / entrySum;
        this.averageHumidity = humiditySum / entrySum;
        if (this.averageTemperature > 30) {
          this.averageTemperatureColor = 'danger-high';
        } else if (this.averageTemperature < 10) {
          this.averageTemperatureColor = 'danger-low';
        } else {
          this.averageTemperatureColor = 'primary';
        }
        console.log(
          this.averageTemperatureColor,
          this.averageTemperature,
          this.averageHumidity,
          this.averageAlertColor,
          this.lastAlertRecords
        );
        return res;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensors']) {
      console.log(this.sensors);
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
      this.store.dispatch(loadAllBasedSensorReadings({ sensorIds: sensorIds }));
    }
  }

  ngOnInit() {}
}
