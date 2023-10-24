import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-groups',
  templateUrl: 'groups.page.html',
  styleUrls: ['groups.page.scss'],
})
export class GroupsPage {
  constructor(private store: Store) {}
}
