import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id');
    if (this.groupId && +this.groupId) {
      this.groupData$ = this.store.select(Group(this.groupId));
      this.groupData$.subscribe((data) => {
        console.log(data, this.groupId);
        if ((data === undefined || data === null) && this.groupId) {
          console.log('dispatched');
          this.store.dispatch(
            GroupActionGroup.getGroup({ groupId: this.groupId }),
          );
        }
      });
    }
  }
}
