import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { GroupBaseIdentifier } from 'src/app/interfaces/group/group';

@Component({
  selector: 'app-group-summery-card',
  templateUrl: './group-summery-card.component.html',
  styleUrls: ['./group-summery-card.component.scss'],
})
export class GroupSummeryCardComponent {
  @Input() group!: GroupBaseIdentifier;
}
