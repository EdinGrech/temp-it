import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { HomePageRoutingModule } from './home-routing.module';
import { ThemeSettingComponent } from '../../components/theme-setting/theme-setting.component';

//components
import { SensorSummeryCardComponent } from 'src/app/components/sensor/sensor-summery-card/sensor-summery-card.component';
import { MicroSensorSummeryComponent } from 'src/app/components/sensor/micro-sensor-summery/micro-sensor-summery.component';
import { CollectiveSensorSummeryComponent } from 'src/app/components/sensor/collective-sensor-summery/collective-sensor-summery.component';

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HomePageRoutingModule,
    ThemeSettingComponent,
    SensorSummeryCardComponent,
    MicroSensorSummeryComponent,
    CollectiveSensorSummeryComponent,
  ],
})
export class HomePageModule {}
