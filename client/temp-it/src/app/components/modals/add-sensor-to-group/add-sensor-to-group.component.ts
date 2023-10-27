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
import { selectUserSensors } from 'src/app/state/user/user.selectors';

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
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private store: Store<AppState>,
  ) {
    this.store.select(selectUserSensors).subscribe((sensors) => {
      console.log(sensors);
    });
  }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
