import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AddSensorModalComponent } from 'src/app/components/modals/add-sensor-modal/add-sensor-modal.component';
import { SensorDetails } from 'src/app/interfaces/sensor/sensor';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  sensorDetailsList: SensorDetails[] = [
    {
      id: 3,
      name: 'Sensor 1',
      location: 'Living room',
      description: 'This is a sensor in the living room',
      active: true,
      date_created: new Date(),
      allow_group_admins_to_edit: true,
    },
  ];

  constructor(private modalController: ModalController, private store: Store) {}
  ngOnInit(): void {
    //dispatch action to get user sensors
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
