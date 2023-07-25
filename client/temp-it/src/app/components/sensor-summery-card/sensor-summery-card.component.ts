import { Component, OnInit } from '@angular/core';
//impoer ion card
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { TempHumSummeryGraphComponent } from 'src/app/components/graphs/temp-hum-summery-graph/temp-hum-summery-graph.component';

@Component({
  selector: 'app-sensor-summery-card',
  templateUrl: './sensor-summery-card.component.html',
  styleUrls: ['./sensor-summery-card.component.scss'],
  imports: [ IonicModule, CommonModule, TempHumSummeryGraphComponent ],
  standalone: true
})
export class SensorSummeryCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
