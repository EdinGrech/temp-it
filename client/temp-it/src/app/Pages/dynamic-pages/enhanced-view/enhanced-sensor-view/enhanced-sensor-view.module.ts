import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { EnhancedSensorViewPageRoutingModule } from './enhanced-sensor-view-routing.module';

import { EnhancedSensorViewPage } from './enhanced-sensor-view.page';
import { IndividualCustomGraphComponent } from 'src/app/components/graphs/individual-custom-graph/individual-custom-graph.component';
import { DateRangePickerComponent } from "../../../../components/date-range-picker/date-range-picker.component";

@NgModule({
    declarations: [EnhancedSensorViewPage],
    imports: [
        CommonModule,
        IonicModule,
        EnhancedSensorViewPageRoutingModule,
        IndividualCustomGraphComponent,
        DateRangePickerComponent
    ]
})
export class EnhancedSensorViewPageModule {}
