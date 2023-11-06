import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable, Subscription, finalize, interval } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  userAddSensorPin,
  userAddSensorPinDateAdded,
} from 'src/app/state/user/user.selectors';
import { requestUserPin } from 'src/app/state/user/user.actions';
import { SensorService } from 'src/app/services/user/sensor/sensor.service';
import { AppState } from 'src/app/state/app.state';

import { SensorDetailsUpdatable } from 'src/app/interfaces/sensor/sensor';
import { EspSetupService } from 'src/app/services/espSetup/esp-setup.service';
import { selectSensorsSummary } from 'src/app/state/sensor/sensor.selector';
import { SensorActionGroup } from 'src/app/state/sensor/sensor.actions';

type currentStep = 'config' | 'waiting' | 'details' | 'done';
@Component({
  selector: 'app-add-sensor-modal',
  templateUrl: './add-sensor-modal.component.html',
  styleUrls: ['./add-sensor-modal.component.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  standalone: true,
  animations: [
    trigger('formAnimation', [
      state(
        'void',
        style({
          opacity: 0,
        }),
      ),
      state(
        '*',
        style({
          opacity: 1,
        }),
      ),
      transition('void => *', animate('500ms ease-in-out')),
      transition('* => void', animate('500ms ease-in-out')),
    ]),
  ],
})
export class AddSensorModalComponent implements OnInit, OnDestroy {
  sensorDetailsForm!: FormGroup;
  showAlertDetails: boolean = false;

  wifiForm!: FormGroup;
  connectionTested: boolean = false;
  testLoading: boolean = false;
  sensorDetailsFormSub!: Subscription;

  currentStep: currentStep = 'config';

  pinObs: Observable<number | undefined> = this.store.select(userAddSensorPin);
  datePinAddedObs: Observable<Date | undefined> = this.store.select(
    userAddSensorPinDateAdded,
  );
  datePinAdded?: Subscription;
  pinSub?: Subscription;

  lastSensorId?: number;

  private intervalSubscription: Subscription | null = null; // Track the interval subscription
  private initialSensorCount!: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private store: Store<AppState>,
    private sensorService: SensorService,
    private espSetupService: EspSetupService,
  ) {}

  ngOnInit() {
    this.datePinAdded = this.datePinAddedObs.subscribe((date) => {
      //if less then an hour ago
      if (date && new Date().getTime() - date.getTime() < 3600000) {
        this.pinSub = this.pinObs.subscribe((pin) => {
          if (pin as number) {
            this.creteWifiForm(pin!);
          }
        });
      } else {
        this.store.dispatch(requestUserPin());
        this.pinObs.subscribe((pin) => {
          if (pin as number) {
            this.creteWifiForm(pin!);
          }
        });
      }
    });
    this.store.select(selectSensorsSummary).subscribe((sensors) => {
      this.initialSensorCount = sensors.data ? sensors.data.length : 0;
    });
    this.sensorDetailsForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required]],
      active: [true, [Validators.required]],
      allow_group_admins_to_edit: [true, [Validators.required]],
      active_alerts: [false, [Validators.required]],
      high_temp_alert: [30],
      low_temp_alert: [10],
      high_humidity_alert: [80],
      low_humidity_alert: [40],
    });
    this.sensorDetailsForm.valueChanges.subscribe((val) => {
      this.showAlertDetails = val.allowNotifications;
    });
  }

  creteWifiForm(pin: number) {
    this.wifiForm = this.formBuilder.group({
      pin: [
        pin,
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
      wifiName: ['', [Validators.required]],
      wifiPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnDestroy() {
    if (this.pinSub) {
      this.pinSub.unsubscribe();
    }
    this.sensorDetailsFormSub?.unsubscribe();
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalSubscription = null;
    }
  }

  configESP() {
    this.testLoading = true;
    this.espSetupService.testConnection().subscribe((res) => {
      this.testLoading = false;
      if (res === 'ok') {
        setTimeout(() => {
          this.connectionTested = true;
          this.espSetupService
            .setWifi(
              this.wifiForm.value.pin,
              this.wifiForm.value.wifiName,
              this.wifiForm.value.wifiPassword,
            )
            .subscribe(() => {
              finalize;
            });
        }, 1000);
      } else {
        this.connectionTested = false;
      }
    });
  }

  submitForm(): void {
    if (this.wifiForm.valid) {
      this.configESP();
      this.dispatchBeacon4ESP();
      this.currentStep = 'waiting';
    } else {
      this.wifiForm.markAllAsTouched();
    }
  }

  checkUserSensorsCountAndStop(
    condition: (count: number, initialSensorCount: number) => boolean,
  ): Promise<number> {
    return new Promise<number>((resolve) => {
      this.intervalSubscription = interval(7000).subscribe(() => {
        this.sensorService.getUserSensorsCount().subscribe((count: any) => {
          if (condition(count.number_of_sensors, this.initialSensorCount)) {
            this.intervalSubscription?.unsubscribe();
            this.intervalSubscription = null;
            resolve(count);
          }
        });
      });
    });
  }

  startCallingFunctionWithInterval(
    condition: (count: number, initialSensorCount: number) => boolean,
  ): Promise<number> {
    return this.checkUserSensorsCountAndStop(condition);
  }

  stopCondition(count: number, initialSensorCount: number): boolean {
    return count > initialSensorCount ? true : false;
  }

  async onStopped(count: number) {
    this.store.dispatch(SensorActionGroup.requestSensorsSummary());
    this.store.select(selectSensorsSummary).subscribe((sensors) => {
      // ! subject to errors with new changes
      if (!sensors.data) this.lastSensorId = undefined;
      this.lastSensorId = sensors.data![sensors.data!.length - 1].id;

      if (this.currentStep === 'done') return;
      this.currentStep = 'details';
    });
  }

  async dispatchBeacon4ESP() {
    const count = await this.startCallingFunctionWithInterval(
      this.stopCondition,
    );
    await this.onStopped(count);
  }

  close() {
    this.modalController.dismiss();
  }

  testConnection() {
    this.testLoading = true;
    this.espSetupService.testConnection().subscribe((res) => {
      if (res === 'ok') {
        this.connectionTested = true;
      } else {
        this.connectionTested = false;
      }
      this.testLoading = false;
    });
  }

  submitDetailsForm() {
    let SensorDetailsUpdatable: SensorDetailsUpdatable = {
      id: 0,
      updatable: {
        name: '',
        location: '',
        description: '',
        active: false,
        active_alerts: false,
        allow_group_admins_to_edit: false,
        high_temp_alert: undefined,
        low_temp_alert: undefined,
        high_humidity_alert: undefined,
        low_humidity_alert: undefined,
      },
    };

    if (this.sensorDetailsForm.valid) {
      SensorDetailsUpdatable.id = this.lastSensorId!;
      SensorDetailsUpdatable.updatable = this.sensorDetailsForm.value;
      this.sensorService
        .updateSensorDetails(SensorDetailsUpdatable)
        .subscribe(() => {
          this.store.dispatch(SensorActionGroup.requestSensorsSummary());
          this.currentStep = 'done';
        });
    } else {
      this.sensorDetailsForm.markAllAsTouched();
    }
  }
}
