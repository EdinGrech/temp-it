import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddSensorModalComponent } from 'src/app/components/modals/add-sensor-modal/add-sensor-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private modalController: ModalController) {}

  async addSensor(){
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
