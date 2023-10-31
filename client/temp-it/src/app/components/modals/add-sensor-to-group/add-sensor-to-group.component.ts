import { Component } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { SensorActionGroup } from 'src/app/state/sensor/sensor.actions';
import { ContentCache } from 'src/app/interfaces/cache/cache';
import { SensorDetails } from 'src/app/interfaces/sensor/sensor';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupActionGroup } from 'src/app/state/group/group.actions';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/state/group/group.selector';
import {
  Group as GroupInterface,
  GroupSensor,
} from 'src/app/interfaces/group/group';
import { selectSensorsSummary } from 'src/app/state/sensor/sensor.selector';

@Component({
  selector: 'app-add-sensor-to-group',
  templateUrl: './add-sensor-to-group.component.html',
  styleUrls: ['./add-sensor-to-group.component.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule],
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
export class AddSensorToGroupComponent {
  sensors$: Observable<ContentCache<SensorDetails[]>>;
  sensorsDataBehavior: BehaviorSubject<
    { sensor: SensorDetails; selected: boolean }[] | null
  > = new BehaviorSubject<
    { sensor: SensorDetails; selected: boolean }[] | null
  >(null);
  sensorsData$ = this.sensorsDataBehavior.asObservable();
  sensorData?: GroupSensor[];
  groupId?: string;
  groupDetails$: Observable<ContentCache<GroupInterface> | null>;

  retryCounter: {
    max: number;
    current: number;
  } = {
    max: 5,
    current: 0,
  };
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private store: Store<AppState>,
  ) {
    this.groupId = this.navParams.get('groupId');
    this.groupDetails$ = this.store.select(Group(this.groupId));
    this.sensors$ = this.store.select(selectSensorsSummary);
    this.sensors$.subscribe((sensors) => {
      console.log(sensors);
      if (sensors.state === 'EMPTY')
        this.store.dispatch(SensorActionGroup.requestSensorsSummary());
      else if (sensors.state === 'ERROR') {
        if (this.retryCounter.current < this.retryCounter.max) {
          this.store.dispatch(SensorActionGroup.requestSensorsSummary());
          this.retryCounter.current++;
        }
      } else if (sensors.state === 'LOADED') {
        this.sensorData = sensors.data;
        let sensorList: GroupSensor[] | undefined;
        this.groupDetails$.subscribe(
          (_group: ContentCache<GroupInterface> | null) => {
            sensorList = _group?.data?.sensors;
          },
        );
        let selected: boolean = false;
        this.sensorsDataBehavior.next(
          sensors.data!.map((sensor) => {
            if (
              sensorList!.find(
                (_sensor: GroupSensor) => _sensor.id === sensor.id,
              )
            )
              selected = true;
            return {
              sensor,
              selected,
            };
          }),
        );
      }
    });
  }

  submit() {
    if (!this.groupId) return;
    this.sensorsDataBehavior
      .value!.filter((sensor) => sensor.selected)
      .map((sensor) =>
        this.store.dispatch(
          GroupActionGroup.addSensor({
            groupId: this.groupId!,
            sensorId: sensor.sensor.id,
          }),
        ),
      );
    this.sensorsDataBehavior
      .value!.filter(
        (sensor) =>
          !sensor.selected &&
          this.sensorData?.find((s) => s.id === sensor.sensor.id) !== undefined,
      )
      .map((sensor) =>
        this.store.dispatch(
          GroupActionGroup.removeSensor({
            groupId: this.groupId!,
            sensorId: sensor.sensor.id,
          }),
        ),
      );

    this.modalController.dismiss();
  }

  close() {
    this.modalController.dismiss();
  }
}
