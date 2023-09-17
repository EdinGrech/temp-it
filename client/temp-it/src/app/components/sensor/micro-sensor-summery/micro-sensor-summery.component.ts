import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import {
  ReducerSensorData,
  SensorDetails,
} from 'src/app/interfaces/sensor/sensor';
import { AppState } from 'src/app/state/app.state';
import { loadDateBasedSensorReadings } from 'src/app/state/sensor/sensor.actions';
import {
  selectSensorData,
} from 'src/app/state/sensor/sensor.selector';

@Component({
  selector: 'app-micro-sensor-summery',
  templateUrl: './micro-sensor-summery.component.html',
  styleUrls: ['./micro-sensor-summery.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class MicroSensorSummeryComponent implements OnInit, OnChanges {
  @Input() sensor?: SensorDetails;
  sensorData$?: Observable<ReducerSensorData | undefined>;
  temperatureColor: string = 'primary';
  humidityColor: string = 'primary';
  alertColor: string = 'primary';

  constructor(private store: Store<AppState>, private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensor']) {
      this.store.dispatch(
        loadDateBasedSensorReadings({ sensorId: this.sensor!.id as number }),
      );
      this.sensorData$ = this.store
        .select(selectSensorData(this.sensor!.id))
        .pipe(
          map((res) => {
            if (!this.sensor?.active_alerts || !res) return res;
            if (
              res!.sensorDataValues[res!.sensorDataValues.length - 1]!
                .temperature > this.sensor!.high_temp_alert!
            ) {
              this.temperatureColor = 'danger-high';
            } else if (
              res!.sensorDataValues[res!.sensorDataValues.length - 1]!
                .temperature < this.sensor!.low_temp_alert!
            ) {
              this.temperatureColor = 'danger-low';
            } else {
              this.temperatureColor = 'primary';
            }
            if (
              res!.sensorDataValues[res!.sensorDataValues.length - 1]!
                .humidity > this.sensor!.high_humidity_alert!
            ) {
              this.humidityColor = 'danger-high';
            } else if (
              res!.sensorDataValues[res!.sensorDataValues.length - 1]!
                .humidity < this.sensor!.low_humidity_alert!
            ) {
              this.humidityColor = 'danger-low';
            } else {
              this.humidityColor = 'primary';
            }
            if (res!.alertFailIndexes.length <= 0) {
              this.alertColor = 'primary';
            } else if (res!.alertFailIndexes.length <= 10) {
              this.alertColor = 'danger-low';
            } else {
              this.alertColor = 'danger-high';
            }
            return res;
          }),
        );
    }
  }

  ngOnInit() {}

  navigateToCard(id?: number) {
    if (id) {
      this.router.navigate([`/tabs/my-sensors/${id}`])
    }
  }

}
