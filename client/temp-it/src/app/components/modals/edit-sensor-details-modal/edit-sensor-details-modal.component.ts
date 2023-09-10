import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { SensorService } from 'src/app/services/user/sensor/sensor.service';

import { SensorDetails, SensorDetailsUpdatable } from 'src/app/interfaces/sensor/sensor';
import { selectUserSensor } from 'src/app/state/user/user.selectors';
import { requestUserSensors } from 'src/app/state/user/user.actions';
import { AppState } from 'src/app/state/app.state';

type currentStep = 'details' | 'done';

@Component({
  selector: 'app-edit-sensor-details-modal',
  templateUrl: './edit-sensor-details-modal.component.html',
  styleUrls: ['./edit-sensor-details-modal.component.scss'],
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
export class EditSensorDetailsModalComponent implements OnInit {
  @Input() sensorId!: number;

  sensorDetailsForm!: FormGroup;
  showAlertDetails: boolean = false;
  
  currentStep: currentStep = 'details';

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private store: Store<AppState>,
    private sensorService: SensorService
  ) {}

  ngOnInit() {
    this.store.select(selectUserSensor(this.sensorId)).subscribe((sensor:SensorDetails|undefined) => {
      this.showAlertDetails = sensor?.active_alerts as boolean;
      this.sensorDetailsForm = this.formBuilder.group({
        name: [sensor?.name, [Validators.required]],
        location: [sensor?.location, [Validators.required]],
        description: [sensor?.description, [Validators.required]],
        active: [sensor?.active, [Validators.required]],
        allow_group_admins_to_edit: [sensor?.allow_group_admins_to_edit, [Validators.required]],
        active_alerts: [sensor?.active_alerts, [Validators.required]],
        high_temp_alert: [sensor?.high_temp_alert? sensor?.high_temp_alert : 30],
        low_temp_alert: [sensor?.low_temp_alert? sensor?.low_temp_alert : 15],
        high_humidity_alert: [sensor?.high_humidity_alert? sensor?.high_humidity_alert : 80],
        low_humidity_alert: [sensor?.low_humidity_alert? sensor?.low_humidity_alert : 20],
      });
      this.sensorDetailsForm.valueChanges.subscribe((val) => {
        this.showAlertDetails = val.active_alerts;
      });
    });
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
      SensorDetailsUpdatable.id = this.sensorId;
      SensorDetailsUpdatable.updatable = this.sensorDetailsForm.value;
      this.sensorService.updateSensorDetails(SensorDetailsUpdatable).subscribe(() => {
        this.store.dispatch(requestUserSensors());
        this.currentStep = 'done';
      });
    } else {
      this.sensorDetailsForm.markAllAsTouched();
    }
  }

  close() {
    this.modalController.dismiss();
  }

  done() {
    this.modalController.dismiss();
  }
}
