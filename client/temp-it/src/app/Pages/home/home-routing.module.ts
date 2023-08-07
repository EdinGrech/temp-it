import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'enhanced-view',
    loadChildren: () => import('src/app/Pages/dynamic-pages/enhanced-view/enhanced-sensor-view/enhanced-sensor-view.module').then( m => m.EnhancedSensorViewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
