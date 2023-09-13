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
} from 'src/app/interfaces/sensor/sensor';
import { AppState } from 'src/app/state/app.state';
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

  constructor(private store: Store<AppState>) {
    // this.store.select(selectSensorAll).subscribe((res) => {
    //   console.log(res);
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensors']) {
      // this.store.dispatch(
      //   loadDateBasedSensorReadings({ sensorId: this.sensor!.id as number }),
      // );
      this.sensorsData$ = this.store.select(selectSensorAll).pipe(
        map((res) => {
          return res;
        }),
      );
    }
  }

  ngOnInit() {}
}
