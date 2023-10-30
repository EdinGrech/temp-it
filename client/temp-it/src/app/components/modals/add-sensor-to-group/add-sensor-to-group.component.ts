import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectSensorsSummary } from 'src/app/state/sensor/sensor.selector';
import { SensorActionGroup } from 'src/app/state/sensor/sensor.actions';
import { Observable } from 'rxjs';
import { SensorDetails } from 'src/app/interfaces/sensor/sensor';
import { ContentCache } from 'src/app/interfaces/cache/cache';

@Component({
  selector: 'app-add-sensor-to-group',
  templateUrl: './add-sensor-to-group.component.html',
  styleUrls: ['./add-sensor-to-group.component.scss'],
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
export class AddSensorToGroupComponent implements OnInit {
  sensorsSummary$: Observable<ContentCache<SensorDetails[]>>;
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private store: Store<AppState>,
  ) {
    this.sensorsSummary$ = this.store.select(selectSensorsSummary);
    this.sensorsSummary$.subscribe((sensors) => {
      console.log(sensors);
      if (sensors.state === 'EMPTY')
        this.store.dispatch(SensorActionGroup.requestSensorsSummary());
    });
  }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
