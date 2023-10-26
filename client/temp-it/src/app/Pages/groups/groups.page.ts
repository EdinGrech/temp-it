import { Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AddGroupModalComponent } from 'src/app/components/modals/add-group-modal/add-group-modal.component';
import { ContentCache } from 'src/app/interfaces/cache/cache';
import { GroupsSummery } from 'src/app/interfaces/group/group';
import { AppState } from 'src/app/state/app.state';
import { GroupActionGroup } from 'src/app/state/group/group.actions';
import { GroupSummery } from 'src/app/state/group/group.selector';

@Component({
  selector: 'app-groups',
  templateUrl: 'groups.page.html',
  styleUrls: ['groups.page.scss'],
})
export class GroupsPage implements OnDestroy {
  groupSummery$: Observable<ContentCache<GroupsSummery>>;
  groupSummerySub?: Subscription;
  constructor(
    private modalController: ModalController,
    private store: Store<AppState>) {
    this.store.dispatch(GroupActionGroup.getGroups());
    this.groupSummery$ = this.store.select(GroupSummery);
    this.groupSummerySub = this.groupSummery$.subscribe((groupSummery) => {
      console.log(groupSummery);
    });
  }

  async addGroup(){
    console.log('add group');
    const modal2 = await this.modalController.create({
      component: AddGroupModalComponent,
    });

    await modal2.present();
  }

  ngOnDestroy(): void {
    this.groupSummerySub?.unsubscribe();
  }
}
