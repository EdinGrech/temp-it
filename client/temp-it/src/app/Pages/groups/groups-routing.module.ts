import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsPage } from './groups.page';

const routes: Routes = [
  {
    path: '',
    component: GroupsPage,
  },
  {
    path: 'group/:id',
    loadChildren: () =>
      import('src/app/Pages/dynamic-pages/group-view/group-view.module').then(
        (m) => m.GroupViewPageModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsPageRoutingModule {}
