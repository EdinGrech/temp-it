import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { EditSensorDetailsModalComponent } from 'src/app/components/modals/edit-sensor-details-modal/edit-sensor-details-modal.component';

import { TempHumSummeryGraphComponent } from 'src/app/components/graphs/temp-hum-summery-graph/temp-hum-summery-graph.component';
import { SensorDetails, singleSensorData } from 'src/app/interfaces/sensor/sensor';
import { ActivatedRoute, Router } from '@angular/router';
import { SensorService } from 'src/app/services/user/sensor/sensor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sensor-summery-card',
  templateUrl: './sensor-summery-card.component.html',
  styleUrls: ['./sensor-summery-card.component.scss'],
  imports: [ IonicModule, CommonModule, TempHumSummeryGraphComponent ],
  standalone: true
})
export class SensorSummeryCardComponent  implements OnInit {
  @Input() sensorDetails!: SensorDetails;
  sensorLastReading: Observable<singleSensorData> | undefined;

  constructor(private modalController: ModalController,private router: Router,private route: ActivatedRoute, private sensorService: SensorService) { }

  ngOnInit() { 
    this.sensorLastReading = this.sensorService.getUserSensorLastReading(this.sensorDetails.id as number);
  }

  async editSensor() {
    const modal = await this.modalController.create({
      component: EditSensorDetailsModalComponent,
      componentProps: {
        sensorId: (this.sensorDetails.id as number)
      }
    });

    await modal.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  viewSensorDetails(){
    this.router.navigate(['enhanced-view', this.sensorDetails.id], { relativeTo: this.route });
  }

  favSensor(){}
}
