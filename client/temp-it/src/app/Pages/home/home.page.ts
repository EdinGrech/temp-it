import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AddSensorModalComponent } from 'src/app/components/modals/add-sensor-modal/add-sensor-modal.component';
import { SensorDetails } from 'src/app/interfaces/sensor/sensor';
import { AppState } from 'src/app/state/app.state';
import { requestUserSensors } from 'src/app/state/user/user.actions';
import { selectUserSensors } from 'src/app/state/user/user.selectors';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  sensorDetailsList?: SensorDetails[];
  showUserSensors: boolean = false;
  sensorSub?: Subscription;

  constructor(
    private modalController: ModalController,
    private store: Store<AppState>
  ) {}
  ngOnInit(): void {
    this.store.dispatch(requestUserSensors());
    this.sensorSub = this.store
      .select(selectUserSensors)
      .subscribe((sensors) => {
        if (sensors.length > 0) {
          this.showUserSensors = true;
          this.sensorDetailsList = sensors;
        } else {
          this.showUserSensors = false
        }
      });
  }

  handleRefresh(event: any) {
    this.store.dispatch(requestUserSensors());
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ngOnDestroy(): void {
    this.sensorSub?.unsubscribe();
  }

  async addSensor() {
    const modal = await this.modalController.create({
      component: AddSensorModalComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log(data);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
