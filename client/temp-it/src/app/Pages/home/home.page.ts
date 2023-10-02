import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
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
  sensors$?: Observable<SensorDetails[]>;

  constructor(
    private modalController: ModalController,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(requestUserSensors());
    this.sensors$ = this.store.select(selectUserSensors);
  }

  @ViewChild(IonContent) content!: IonContent;
  scrollToTop() {
    this.content.scrollToTop(200);
  }

  lastScrollSpot: number = 0;
  onScroll(event: any) {
    const scrollPosition = event.detail.scrollTop;
    const fab = document.querySelector('ion-fab');
    if (scrollPosition < this.lastScrollSpot) {
      fab?.classList.add('show');
    } else {
      fab?.classList.remove('show');
    }
    this.lastScrollSpot = scrollPosition;
  }

  handleRefresh(event: any) {
    this.store.dispatch(requestUserSensors());
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async addSensor() {
    const modal = await this.modalController.create({
      component: AddSensorModalComponent,
    });

    await modal.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
