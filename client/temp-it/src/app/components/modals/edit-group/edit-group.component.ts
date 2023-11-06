import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ContentCache } from 'src/app/interfaces/cache/cache';
import { AppState } from 'src/app/state/app.state';
import { Group } from 'src/app/state/group/group.selector';
import { Group as GroupInterface } from 'src/app/interfaces/group/group';
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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddSensorToGroupComponent } from '../add-sensor-to-group/add-sensor-to-group.component';
import { AddMemberToGroupComponent } from '../add-member-to-group/add-member-to-group.component';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss'],
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
export class EditGroupComponent implements OnDestroy {
  groupId?: string;
  groupDetails$: Observable<ContentCache<GroupInterface> | null>;
  groupDetSub: Subscription;
  groupDetailForm?: FormGroup;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
  ) {
    this.groupId = this.navParams.get('groupId');
    this.groupDetails$ = this.store.select(Group(this.groupId));
    this.groupDetSub = this.groupDetails$.subscribe((data) => {
      if (data && data.data) {
        this.groupDetailForm = this.formBuilder.group({
          name: [data.data.group.name, [Validators.required]],
          description: [data.data.group.description, [Validators.required]],
        });
      }
    });
  }

  close() {
    this.modalController.dismiss();
  }

  submit() {}

  async editAdmins() {
    const modal = await this.modalController.create({
      component: AddSensorToGroupComponent,
      componentProps: {
        groupId: this.groupId,
      },
    });

    await modal.present();
  }

  async editMembers() {
    const modal = await this.modalController.create({
      component: AddMemberToGroupComponent,
      componentProps: {
        groupId: this.groupId,
      },
    });

    await modal.present();
  }

  async editSensors() {
    const modal = await this.modalController.create({
      component: AddSensorToGroupComponent,
      componentProps: {
        groupId: this.groupId,
      },
    });

    await modal.present();
  }

  ngOnDestroy(): void {
    this.groupDetSub?.unsubscribe();
  }
}
