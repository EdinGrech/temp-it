import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AddSensorModalComponent } from 'src/app/components/modals/add-sensor-modal/add-sensor-modal.component';
import { SensorDetails } from 'src/app/interfaces/sensor/sensor';
import { AppState } from 'src/app/state/app.state';
import { requestUserSensors } from 'src/app/state/user/user.actions';
import { selectUserSensors } from 'src/app/state/user/user.selectors';
import { isMobile } from 'src/app/utils/mobile-detection';

@Component({
  selector: 'app-my-sensors',
  templateUrl: 'my-sensors.page.html',
  styleUrls: ['my-sensors.page.scss'],
})
export class MySensorsPage implements OnInit {
  sensorDetailsList?: SensorDetails[];
  showUserSensors: boolean = false;
  sensorSub?: Subscription;

  constructor(
    private modalController: ModalController,
    private store: Store<AppState>,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(requestUserSensors());
    this.sensorSub = this.store
      .select(selectUserSensors)
      .subscribe((sensors) => {
        if (sensors.length > 0) {
          this.showUserSensors = true;
          this.sensorDetailsList = [...sensors].sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;
            return 0;
          });
        } else {
          this.showUserSensors = false;
        }
      });
      // Scroll to the target card if the query param is present.
      this.route.params.subscribe(params => {
        const id = params['id'];
        if (id) {
          // Find and scroll to the target card.
          setTimeout(() => {
            const cardElement = this.elementRef.nativeElement.querySelector(`[id="${id}"]`);
            if (cardElement) {
              cardElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);
        }
      });
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
    this.mainRefresh();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  mainRefresh() {
    this.store.dispatch(requestUserSensors());
  }

  ngOnDestroy(): void {
    this.sensorSub?.unsubscribe();
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

  isMobile_(size: number): boolean {
    return isMobile(size);
  }
}
