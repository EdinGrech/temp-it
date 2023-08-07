import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnhancedSensorViewPageRoutingModule } from './enhanced-sensor-view-routing.module';

import { EnhancedSensorViewPage } from './enhanced-sensor-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnhancedSensorViewPageRoutingModule
  ],
  declarations: [EnhancedSensorViewPage]
})
export class EnhancedSensorViewPageModule {}
