import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentCache } from 'src/app/interfaces/cache/cache';
import { GroupsSummery } from 'src/app/interfaces/group/group';

@Component({
  selector: 'app-group-summery-card',
  templateUrl: './group-summery-card.component.html',
  styleUrls: ['./group-summery-card.component.scss'],
})
export class GroupSummeryCardComponent {
  @Input() groupSummery$?: Observable<ContentCache<GroupsSummery>>;
}
