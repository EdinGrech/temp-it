import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupViewPageRoutingModule } from './group-view-routing.module';

import { GroupViewPage } from './group-view.page';
import { SensorSummeryCardComponent } from 'src/app/components/sensor/sensor-summery-card/sensor-summery-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupViewPageRoutingModule,
    SensorSummeryCardComponent,
  ],
  declarations: [GroupViewPage],
})
export class GroupViewPageModule {}
