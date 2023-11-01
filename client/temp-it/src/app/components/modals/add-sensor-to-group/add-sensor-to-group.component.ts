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
import { Group } from 'src/app/state/group/group.selector';
import { Group as GroupInterface } from 'src/app/interfaces/group/group';
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
  sensorDataUserHas?: SensorDetails[];
  groupId?: string;
  groupDetails$: Observable<ContentCache<GroupInterface> | null>;

  sensorListInGroup: SensorDetails[] | undefined;

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
      if (sensors.state === 'EMPTY')
        this.store.dispatch(SensorActionGroup.requestSensorsSummary());
      else if (sensors.state === 'ERROR') {
        if (this.retryCounter.current < this.retryCounter.max) {
          this.store.dispatch(SensorActionGroup.requestSensorsSummary());
          this.retryCounter.current++;
        }
      } else if (sensors.state === 'LOADED') {
        this.sensorDataUserHas = sensors.data;
        let sensorListInGroup: SensorDetails[] | undefined;
        this.groupDetails$.subscribe(
          (_group: ContentCache<GroupInterface> | null) => {
            sensorListInGroup = _group?.data?.sensors;
          },
        );
        this.sensorListInGroup = sensorListInGroup;
        let selected: boolean = false;
        this.sensorsDataBehavior.next(
          sensors.data!.map((sensor) => {
            if (
              sensorListInGroup!.find(
                (_sensor: SensorDetails) => _sensor.id === sensor.id,
              )
            )
              selected = true;
            else selected = false;
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
      .value!.filter((sensor) => {
        return (
          sensor.selected &&
          !this.sensorListInGroup?.find((s) => s.id === sensor.sensor.id)
        );
      })
      .map((sensor) => {
        this.store.dispatch(
          GroupActionGroup.addSensor({
            groupId: this.groupId!,
            sensorId: sensor.sensor.id,
          }),
        );
      });
    this.sensorsDataBehavior
      .value!.filter((sensor) => {
        if (
          !sensor.selected &&
          this.sensorListInGroup?.find((s) => s.id === sensor.sensor.id)
        )
          return true;
        return false;
      })
      .map((sensor) => {
        this.store.dispatch(
          GroupActionGroup.removeSensor({
            groupId: this.groupId!,
            sensorId: sensor.sensor.id,
          }),
        );
      });
    setTimeout(() => {
      this.store.dispatch(
        GroupActionGroup.getGroup({ groupId: this.groupId! }),
      );
    }, 100);
    this.modalController.dismiss();
  }

  close() {
    this.modalController.dismiss();
  }
}
