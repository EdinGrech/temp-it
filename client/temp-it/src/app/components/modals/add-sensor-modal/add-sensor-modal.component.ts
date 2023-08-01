import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  userAddSensorPin,
  userAddSensorPinDateAdded,
} from 'src/app/state/user/user.selectors';
import { requestUserPin } from 'src/app/state/user/user.actions';

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
export class AddSensorModalComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private store: Store<{ auth: any; global: any }>
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
    this.sensorDetailsForm = this.formBuilder.group({
      sensorName: ['', [Validators.required]],
      sensorLocation: ['', [Validators.required]],
      description: ['', [Validators.required]],
      active: [true, [Validators.required]],
      allowAdminsToEdit: [true, [Validators.required]],
      allowNotifications: [false, [Validators.required]],
      maxTempAllowed: [30],
      minTempAllowed: [10],
      maxHumAllowed: [80],
      minHumAllowed: [40],
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

  ngOndestroy() {
    if (this.pinSub) {
      this.pinSub.unsubscribe();
    }
    this.sensorDetailsFormSub.unsubscribe();
  }

  getUserPin() {}

  submitForm(): void {
    if (this.wifiForm.valid) {
      // Send form data to esp32
      console.log(this.wifiForm.value);
      this.dispatchBeacon4ESP()
      // wait for esp32 to respond
      this.currentStep = 'waiting';
    } else {
      // Handle form validation errors if needed
      console.log('Invalid form data');
      this.wifiForm.markAllAsTouched();
    }
  }

  dispatchBeacon4ESP(){
    //have a dispatch here that will get the sensor id
    setTimeout(() => {
      this.currentStep = 'details';
    }
    , 13000);
  }

  close() {
    this.modalController.dismiss();
  }

  testConnection() {
    this.testLoading = true;
    setTimeout(() => {
      this.testLoading = false;
      this.connectionTested = true;
    }, 2000);
    console.log('Testing connection');
  }

  submitDetailsForm() {
    let formValue;
    if (this.sensorDetailsForm.valid) {
      if(this.sensorDetailsForm.value.allowNotifications){
        formValue = this.sensorDetailsForm.value;
      }else{
        formValue = {
          // all of the form values except allowNotifications
          sensorName: this.sensorDetailsForm.value.sensorName,
          sensorLocation: this.sensorDetailsForm.value.sensorLocation,
          description: this.sensorDetailsForm.value.description,
          active: this.sensorDetailsForm.value.active,
          allowAdminsToEdit: this.sensorDetailsForm.value.allowAdminsToEdit,
        }
      }
      this.currentStep = 'done';
      console.log(formValue);
    } else {
      this.sensorDetailsForm.markAllAsTouched();
      //print what fields are invalid
      console.log(this.sensorDetailsForm);
    }
  }

  done() {
    this.modalController.dismiss(this.wifiForm.value);
  }
}
