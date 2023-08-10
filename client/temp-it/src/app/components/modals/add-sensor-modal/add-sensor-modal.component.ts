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
import { Observable, Subscription, interval } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  selectUserSensors,
  userAddSensorPin,
  userAddSensorPinDateAdded,
} from 'src/app/state/user/user.selectors';
import {
  requestUserPin, requestUserSensors,
} from 'src/app/state/user/user.actions';
import { SensorService } from 'src/app/services/user/sensor/sensor.service';
import { AppState } from 'src/app/state/app.state';

import { SensorDetails, SensorDetailsUpdatable } from 'src/app/interfaces/sensor/sensor';

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
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
        })
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
  connectionTested?: boolean;
  testLoading: boolean = false;
  sensorDetailsFormSub!: Subscription;

  currentStep: currentStep = 'config';

  pinObs: Observable<number | undefined> = this.store.select(userAddSensorPin);
  datePinAddedObs: Observable<Date | undefined> = this.store.select(
    userAddSensorPinDateAdded
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
    private sensorService: SensorService
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
    this.store.select(selectUserSensors).subscribe((sensors) => {
      this.initialSensorCount = sensors.length;
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

  getUserPin() {}

  submitForm(): void {
    if (this.wifiForm.valid) {
      // Send form data to esp32
      console.log(this.wifiForm.value);
      this.dispatchBeacon4ESP();
      // wait for esp32 to respond
      this.currentStep = 'waiting';
    } else {
      // Handle form validation errors if needed
      console.log('Invalid form data');
      this.wifiForm.markAllAsTouched();
    }
  }

  checkUserSensorsCountAndStop(condition: (count: number,initialSensorCount:number) => boolean): Promise<number> {
    return new Promise<number>((resolve) => {
      this.intervalSubscription = interval(7000).subscribe(() => {
        this.sensorService.getUserSensorsCount().subscribe((count:any) => {
          if (condition(count.number_of_sensors,this.initialSensorCount)) {
            this.intervalSubscription?.unsubscribe();
            this.intervalSubscription = null;
            resolve(count);
          }
        });
      });
    });
  }

  startCallingFunctionWithInterval(condition: (count: number,initialSensorCount:number) => boolean): Promise<number> {
    return this.checkUserSensorsCountAndStop(condition);
  }

  stopCondition(count: number,initialSensorCount:number): boolean {
    return count > initialSensorCount ? true : false; 
  }

  async onStopped(count: number) {
    this.store.dispatch(requestUserSensors());
    this.store.select(selectUserSensors).subscribe((sensors) => {
    this.lastSensorId = sensors[sensors.length - 1].id;
    this.currentStep = 'details';
    });
  }

  async dispatchBeacon4ESP() {
    const count = await this.startCallingFunctionWithInterval(this.stopCondition);
    await this.onStopped(count);
  }

  close() {
    this.modalController.dismiss();
  }

  testConnection() {
    //to be done
    this.testLoading = true;
    setTimeout(() => {
      this.testLoading = false;
      this.connectionTested = true;
    }, 2000);
    console.log('Testing connection');
  }

  submitDetailsForm() {
    let SensorDetailsUpdatable:SensorDetailsUpdatable = {
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
        low_humidity_alert: undefined
      }
    };

    if (this.sensorDetailsForm.valid) {
      SensorDetailsUpdatable.id = this.lastSensorId!;
      SensorDetailsUpdatable.updatable = this.sensorDetailsForm.value;
      this.sensorService.updateSensorDetails(SensorDetailsUpdatable).subscribe((res) => {
        console.log(res);
        this.store.dispatch(requestUserSensors());
        this.currentStep = 'done';
      });
    } else {
      this.sensorDetailsForm.markAllAsTouched();
      console.log(this.sensorDetailsForm);
    }
  }

  // submitDetailsForm() {
  //   let formValue;
  //   if (this.sensorDetailsForm.valid) {
  //     if (this.sensorDetailsForm.value.allowNotifications) {
  //       formValue = this.sensorDetailsForm.value;
  //     } else {
  //       formValue = {
  //         // all of the form values except allowNotifications
  //         sensorName: this.sensorDetailsForm.value.sensorName,
  //         sensorLocation: this.sensorDetailsForm.value.sensorLocation,
  //         description: this.sensorDetailsForm.value.description,
  //         active: this.sensorDetailsForm.value.active,
  //         allowAdminsToEdit: this.sensorDetailsForm.value.allowAdminsToEdit,
  //       };
  //     }
  //     this.currentStep = 'done';
  //   } else {
  //     this.sensorDetailsForm.markAllAsTouched();
  //   }
  // }

  done() {
    this.modalController.dismiss(this.wifiForm.value);
  }
}
