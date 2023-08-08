import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SensorDetails } from 'src/app/interfaces/sensor/sensor';
import { AppState } from 'src/app/state/app.state';
import { selectUserSensor } from 'src/app/state/user/user.selectors';

@Component({
  selector: 'app-enhanced-sensor-view',
  templateUrl: './enhanced-sensor-view.page.html',
  styleUrls: ['./enhanced-sensor-view.page.scss'],
})
export class EnhancedSensorViewPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let sensorId:number = params['id'];
      this.store.select(selectUserSensor(sensorId)).subscribe((sensor:SensorDetails|undefined) => {
        console.log(sensor);
      });
    });
  }

}
