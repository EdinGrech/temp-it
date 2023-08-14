import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { SensorDetails } from 'src/app/interfaces/sensor/sensor';
import { AppState } from 'src/app/state/app.state';
import { selectUserSensor } from 'src/app/state/user/user.selectors';
import { EditSensorDetailsModalComponent } from 'src/app/components/modals/edit-sensor-details-modal/edit-sensor-details-modal.component';
import { requestUserSensors } from 'src/app/state/user/user.actions';
import { SensorService } from 'src/app/services/user/sensor/sensor.service';
import { first } from 'rxjs';
import { globalError } from 'src/app/state/global/global.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-enhanced-sensor-view',
  templateUrl: './enhanced-sensor-view.page.html',
  styleUrls: ['./enhanced-sensor-view.page.scss'],
})
export class EnhancedSensorViewPage implements OnInit {

  sensor?: SensorDetails;
  selectedDatetime?: string;

  dateRange?:{start: string, end: string};

  //min 6 months ago
  minDate: string = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString();
  maxDate: string = new Date().toISOString();
  invalidDates: boolean = true;
  rawData: any;
  dateChange4LookUp: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private modalController: ModalController,
    private sensorService: SensorService,
    private alertController: AlertController
    ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let sensorId:number = parseInt(params['id']);
      if(isNaN(sensorId)) this.router.navigate(['']);
      let called = false;
      this.store.select(selectUserSensor(sensorId)).subscribe((sensor:SensorDetails|undefined) => {
        if(!sensor && !called){
          called = true;
          this.store.dispatch(requestUserSensors());
        }
        this.sensor = sensor;
      });
    });
  }

  async editSensor() {
    const modal = await this.modalController.create({
      component: EditSensorDetailsModalComponent,
      componentProps: {
        sensorId: (this.sensor!.id as number)
      }
    });

    await modal.present();
  }

  async deleteSensor(){
    const alert = await this.alertController.create({
      header: 'Delete Action',
      message: 'Are you sure you want to delete this sensor',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteConfirmed()
        }
      }, 'Cancel'],
    });

    await alert.present();

    await alert.onDidDismiss();

  }

  deleteConfirmed(){
    this.sensorService.deleteUserSensor(this.sensor!.id).pipe(first()).subscribe(data_ => {
      let data:any = data_
      if(data.message == 'Sensor deleted'){
        this.store.dispatch(requestUserSensors());
        this.router.navigate(['']);
      }
      else{
        this.store.dispatch(globalError({error: (data as any) as HttpErrorResponse}));
      }
    });
  }

  datetimeChanged(dateRange: {start: string, end: string},) {
    this.dateRange = dateRange;
    this.dateChange4LookUp = true;
  }

  getSensorReadings(){
    if(this.dateRange?.start && this.dateRange?.end && this.dateChange4LookUp){
      this.sensorService.getUserSensorDataCustomRange(this.dateRange?.start, this.dateRange?.end, this.sensor!.id).pipe(first()).subscribe(data => {
        this.rawData = data;
        this.dateChange4LookUp = false;
      });
    }
  }
}
