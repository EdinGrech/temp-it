import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-member-to-group',
  templateUrl: './add-member-to-group.component.html',
  styleUrls: ['./add-member-to-group.component.scss'],
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
export class AddMemberToGroupComponent implements OnInit {
  groupId?: string;
  groupDetails$: Observable<ContentCache<GroupInterface> | null>;
  usernameInForm?: string;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private store: Store<AppState>,
  ) {
    this.groupId = this.navParams.get('groupId');
    this.groupDetails$ = this.store.select(Group(this.groupId));
  }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  submit() {}

  removeMember(username: string) {}
}
