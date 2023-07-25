import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './home-routing.module';
import { ThemeSettingComponent } from "../../components/theme-setting/theme-setting.component";

//components
import { SensorSummeryCardComponent } from 'src/app/components/sensor-summery-card/sensor-summery-card.component';

@NgModule({
    declarations: [HomePage],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        Tab1PageRoutingModule,
        ThemeSettingComponent,
        SensorSummeryCardComponent
    ]
})
export class HomePageModule {}
