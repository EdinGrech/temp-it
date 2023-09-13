import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MySensorsPage } from './my-sensors.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

//components
import { ThemeSettingComponent } from '../../components/theme-setting/theme-setting.component';
import { SensorSummeryCardComponent } from 'src/app/components/sensor/sensor-summery-card/sensor-summery-card.component';

import { MySensorsPageRoutingModule } from './my-sensors-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MySensorsPageRoutingModule,
    ThemeSettingComponent,
    SensorSummeryCardComponent,
  ],
  declarations: [MySensorsPage],
})
export class MySensorsPageModule {}
