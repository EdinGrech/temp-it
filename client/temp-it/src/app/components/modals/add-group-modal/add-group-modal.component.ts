import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CacheContentState } from 'src/app/interfaces/cache/cache';
import { AppState } from 'src/app/state/app.state';
import { GroupActionGroup } from 'src/app/state/group/group.actions';
import { GroupActions } from 'src/app/state/group/group.selector';

type currentStep = 'details' | 'pending' |'done';

@Component({
  selector: 'app-add-group-modal',
  templateUrl: './add-group-modal.component.html',
  styleUrls: ['./add-group-modal.component.scss'],
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
export class AddGroupModalComponent  implements OnDestroy {
  currentStep: currentStep = 'details';
  createGroupForm!: FormGroup;
  actionState?: CacheContentState;
  actionStateSub?: Subscription;
  constructor(
    private modalController: ModalController,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
  ) {
    this.createGroupForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  submitDetailsForm(){
    this.createGroupForm.markAllAsTouched();
    if(this.createGroupForm.valid){
      this.currentStep = 'pending';
      this.store.dispatch(GroupActionGroup.createGroup({ group: this.createGroupForm.value }));
      this.actionStateSub = this.store.select(GroupActions). subscribe((action) => {
        this.actionState = action?.createGroup?.state
        if (this.actionState === "LOADED") {
          this.currentStep = 'done';
        }
      })
    }
  }

  close() {
    this.modalController.dismiss();
  }

  ngOnDestroy(): void {
      this.actionStateSub?.unsubscribe();
  }
}
