import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { EditSensorDetailsModalComponent } from 'src/app/components/modals/edit-sensor-details-modal/edit-sensor-details-modal.component';

import { TempHumSummeryGraphComponent } from 'src/app/components/graphs/temp-hum-summery-graph/temp-hum-summery-graph.component';
import {
  SensorDetails,
  SensorReadingData,
} from 'src/app/interfaces/sensor/sensor';
import { Router } from '@angular/router';
import { SensorService } from 'src/app/services/user/sensor/sensor.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-sensor-summery-card',
  templateUrl: './sensor-summery-card.component.html',
  styleUrls: ['./sensor-summery-card.component.scss'],
  imports: [IonicModule, CommonModule, TempHumSummeryGraphComponent],
  standalone: true,
})
export class SensorSummeryCardComponent implements OnInit {
  @Input() sensorDetails!: SensorDetails;
  @Input() groupView: boolean = false;
  @Input() allowEdit: boolean = true;
  localFav?: boolean;
  sensorLastReading: Observable<SensorReadingData> | undefined;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private sensorService: SensorService,
  ) {}

  ngOnInit() {
    this.sensorLastReading = this.sensorService
      .getUserSensorLastReading(this.sensorDetails.id as number)
      .pipe(
        map((reading) => {
          return {
            date_time: reading.date_time,
            temperature: parseFloat(reading.temperature.toFixed(1)),
            humidity: parseFloat(reading.humidity.toFixed(1)),
          };
        }),
      );
    this.localFav = this.sensorDetails.favorite;
  }

  async editSensor() {
    const modal = await this.modalController.create({
      component: EditSensorDetailsModalComponent,
      componentProps: {
        sensorId: this.sensorDetails.id as number,
      },
    });

    await modal.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  viewSensorDetails() {
    this.router.navigate([
      '/tabs/my-sensors/enhanced-view',
      this.sensorDetails.id,
    ]);
  }

  favSensor() {
    this.sensorService
      .favoriteSensor(this.sensorDetails.id as number)
      .subscribe((res) => {
        this.localFav = !this.localFav;
      });
  }
}
