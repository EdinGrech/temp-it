import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupsPage } from './groups.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { GroupsPageRoutingModule } from './groups-routing.module';
import { GroupSummeryCardComponent } from 'src/app/components/group/group-summery-card/group-summery-card.component';
import { GroupSummeryListComponent } from 'src/app/components/group/group-summery-list/group-summery-list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    GroupsPageRoutingModule,
  ],
  declarations: [
    GroupsPage,
    GroupSummeryCardComponent,
    GroupSummeryListComponent,
  ],
})
export class GroupsPageModule {}
