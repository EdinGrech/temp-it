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

  sensor?: SensorDetails;
  selectedDatetime?: string;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let sensorId:number = params['id'];
      this.store.select(selectUserSensor(sensorId)).subscribe((sensor:SensorDetails|undefined) => {
        this.sensor = sensor;
        this.handleSensorUpdate();
      });
    });
  }

  handleSensorUpdate(){
    //this.sensor
    
  }

  datetimeChanged(event: any) {
    this.selectedDatetime = event.detail.value; // Update the selected datetime.
    console.log(this.selectedDatetime);
    // You can perform additional actions here if needed.
  }

}
