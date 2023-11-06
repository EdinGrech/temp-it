import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddSensorToGroupComponent } from 'src/app/components/modals/add-sensor-to-group/add-sensor-to-group.component';
import { EditGroupComponent } from 'src/app/components/modals/edit-group/edit-group.component';
import { ContentCache } from 'src/app/interfaces/cache/cache';
import { Group as GroupInterface } from 'src/app/interfaces/group/group';
import { AppState } from 'src/app/state/app.state';
import { GroupActionGroup } from 'src/app/state/group/group.actions';
import { Group } from 'src/app/state/group/group.selector';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.page.html',
  styleUrls: ['./group-view.page.scss'],
})
export class GroupViewPage implements OnInit {
  groupId?: string | null;
  groupData$?: Observable<ContentCache<GroupInterface> | null>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id');
    if (this.groupId && +this.groupId) {
      this.groupData$ = this.store.select(Group(this.groupId));
      this.groupData$.subscribe((data) => {
        if ((data === undefined || data === null) && this.groupId) {
          this.store.dispatch(
            GroupActionGroup.getGroup({ groupId: this.groupId }),
          );
        }
      });
    }
  }

  async addSensor() {
    const modal = await this.modalController.create({
      component: AddSensorToGroupComponent,
      componentProps: {
        groupId: this.groupId,
      },
    });

    await modal.present();
  }

  async editGroup() {
    const modal = await this.modalController.create({
      component: EditGroupComponent,
      componentProps: {
        groupId: this.groupId,
      },
    });

    await modal.present();
  }

  handleRefresh(event: any) {
    this.mainRefresh();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  mainRefresh() {
    this.store.dispatch(GroupActionGroup.getGroup({ groupId: this.groupId! }));
  }
}
