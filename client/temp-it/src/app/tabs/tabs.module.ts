import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { ThemeSettingComponent } from '../components/theme-setting/theme-setting.component';
import { LoaderOverlayComponent } from '../components/loader-overlay/loader-overlay.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, TabsPageRoutingModule, SideBarComponent, ThemeSettingComponent, LoaderOverlayComponent],
  declarations: [TabsPage],
})
export class TabsPageModule {}
