import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MySensorsPage } from './my-sensors.page';

const routes: Routes = [
  {
    path: '',
    component: MySensorsPage,
  },
  {
    path: ':id',
    component: MySensorsPage,
  },
  {
    path: 'enhanced-view/:id',
    loadChildren: () =>
      import(
        'src/app/Pages/dynamic-pages/enhanced-view/enhanced-sensor-view/enhanced-sensor-view.module'
      ).then((m) => m.EnhancedSensorViewPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySensorsPageRoutingModule {}
