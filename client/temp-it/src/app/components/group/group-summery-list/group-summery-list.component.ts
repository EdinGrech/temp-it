import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentCache } from 'src/app/interfaces/cache/cache';
import { GroupsSummery } from 'src/app/interfaces/group/group';
@Component({
  selector: 'app-group-summery-list',
  templateUrl: './group-summery-list.component.html',
  styleUrls: ['./group-summery-list.component.scss'],
})
export class GroupSummeryListComponent {
  @Input() groupSummery$?: Observable<ContentCache<GroupsSummery>>;
}
