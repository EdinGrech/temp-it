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
  wifiForm!: FormGroup;

  connectionTested?: boolean;
  testLoading: boolean = false;

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
  }

  getUserPin() {}

  submitForm(): void {
    if (this.wifiForm.valid && this.connectionTested) {
      // Send form data to backend
      console.log(this.wifiForm.value);
      this.modalController.dismiss(this.wifiForm.value);
    } else {
      // Handle form validation errors if needed
      console.log('Invalid form data');
    }
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
}
