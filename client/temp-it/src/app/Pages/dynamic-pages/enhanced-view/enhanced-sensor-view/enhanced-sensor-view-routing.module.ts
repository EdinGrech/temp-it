import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnhancedSensorViewPage } from './enhanced-sensor-view.page';

const routes: Routes = [
  {
    path: '',
    component: EnhancedSensorViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnhancedSensorViewPageRoutingModule {}
