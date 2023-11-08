import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonicModule,
  ModalController,
  NavParams,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ContentCache } from 'src/app/interfaces/cache/cache';
import { AppState } from 'src/app/state/app.state';
import { Group, MemberActions } from 'src/app/state/group/group.selector';
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
import { GroupActionGroup } from 'src/app/state/group/group.actions';
import { RequestState } from 'src/app/interfaces/state-tracker/state-tracker';

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

  memberObservable$?: Observable<{
    addGroupMember?: RequestState;
    removeGroupMember?: RequestState;
  }>;
  memberSub?: Subscription;

  state?: 'LOADING' | 'LOADED' | 'ERROR' | 'EMPTY';
  errorMessage?: string;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private store: Store<AppState>,
    private alertController: AlertController,
  ) {
    this.groupId = this.navParams.get('groupId');
    this.groupDetails$ = this.store.select(Group(this.groupId));
  }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  submit() {
    if (!this.usernameInForm || !this.groupId) return;
    this.store.dispatch(
      GroupActionGroup.addMember({
        groupId: this.groupId!,
        username: this.usernameInForm!,
      }),
    );
    this.memberObservable$ = this.store.select(MemberActions) as Observable<{
      addGroupMember?: RequestState;
      removeGroupMember?: RequestState;
    }>;
    this.memberSub = this.memberObservable$.subscribe((state) => {
      if (state.addGroupMember?.state) this.state = state.addGroupMember?.state;
      if (
        state.addGroupMember?.state === 'ERROR' &&
        state.addGroupMember?.error
      )
        this.errorMessage = state.addGroupMember?.error;
    });
  }

  removeMember(username: string) {
    if (!this.groupId || !username) return;
    this.presentAlert(
      'Remove Member',
      `Are you sure you want to remove ${username}?`,
      username,
    );
  }

  async presentAlert(
    header: string,
    message: string,
    username: string,
  ): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Yes Remove',
          handler: () => {
            this.memberRevalHandler(username);
            this.close();
          },
        },
        {
          text: 'Cancel',
          handler: () => {
            this.close();
          },
        },
      ],
    });

    await alert.present();

    await alert.onDidDismiss();
  }

  memberRevalHandler(username: string) {
    this.store.dispatch(
      GroupActionGroup.removeMember({
        groupId: this.groupId!,
        username,
      }),
    );
  }
}
