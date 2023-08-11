import {
  Component,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsConfiguration } from 'ng2-charts';
import { NgChartsModule } from 'ng2-charts';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { singleSensorData } from 'src/app/interfaces/sensor/sensor';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-individual-custom-graph',
  templateUrl: './individual-custom-graph.component.html',
  styleUrls: ['./individual-custom-graph.component.scss'],
  imports: [NgChartsModule, CommonModule, IonicModule,],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
  ],
  standalone: true,
})
export class IndividualCustomGraphComponent implements AfterViewInit, OnChanges {
  @Input() rawGraphData?: any;
  height!: number;

  constructor() {
    Chart.register(Annotation);
  }

  isMobile(): boolean {
    const screenWidth = window.innerWidth;
    return screenWidth < 768 ? true : false;
  }

  ngAfterViewInit(): void {
    if (this.isMobile()) {
      this.height = 300;
    } else {
      this.height = 145;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rawGraphData'] && this.rawGraphData) {
      this.rawToGraphData(this.rawGraphData);
    }
  }

  rawToGraphData(rawData: singleSensorData[]): void {
    let dataSkipStep: number;
    if (this.isMobile()) {
      dataSkipStep = Math.round(rawData.length / 72);
    } else {
      dataSkipStep = Math.round(rawData.length / 300);
    }
    this.lineChartData.datasets[0].data = rawData
      .map((data: singleSensorData) => data.temperature)
      .filter((_data, index) => index % dataSkipStep === 0);
    this.lineChartData.datasets[1].data = rawData
      .map((data: singleSensorData) => data.humidity)
      .filter((_data, index) => index % dataSkipStep === 0);
    this.lineChartData.labels = rawData
      .map(
        (data: singleSensorData) =>
          new Date(data.date_time).getDate() +
          '/' +
          new Date(data.date_time).getHours() +
          ':' +
          new Date(data.date_time).getMinutes()
      )
      .filter((_data, index) => index % dataSkipStep === 0) as string[];
    this.chart?.update();
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Temperature',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Humidity',
        yAxisID: 'y1',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      y: {
        labels: ['Temperature'],
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
      y1: {
        labels: ['Humidity'], 
        position: 'left',
      },
    },

    plugins: {
      legend: { display: true },
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
}
