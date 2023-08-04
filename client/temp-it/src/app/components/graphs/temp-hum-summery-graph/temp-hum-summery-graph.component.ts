import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsConfiguration } from 'ng2-charts';
import { NgChartsModule } from 'ng2-charts';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { SensorService } from 'src/app/services/user/sensor/sensor.service';
import { singleSensorData } from 'src/app/interfaces/sensor/sensor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-temp-hum-summery-graph',
  templateUrl: './temp-hum-summery-graph.component.html',
  styleUrls: ['./temp-hum-summery-graph.component.scss'],
  imports: [NgChartsModule, CommonModule],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false }}
  ],
  standalone: true,
})
export class TempHumSummeryGraphComponent implements OnInit{
  @Input() userSensorId!:number;
  private newLabel? = 'New label';
  height!:number;

  constructor(
    private sensorService: SensorService,
  ) {
    Chart.register(Annotation);
  }

  isMobile(): boolean {
    const screenWidth = window.innerWidth;
    return screenWidth < 600 ? true : false;
  }

  ngOnInit():void{
    if(this.isMobile()){
      this.height = 300;
    } else {
      this.height = 100;
    }
    this.sensorService.getSensorLast24Hours(this.userSensorId).subscribe((_data:singleSensorData[]) => {
      this.rawToGraphData(_data);
      this.chart?.update();
    });
  }

  rawToGraphData(rawData: singleSensorData[]): void {
    //if mobile pick every 2nd data point
    if(this.isMobile()){
      this.lineChartData.datasets[0].data = (rawData.map((data:singleSensorData) => data.temperature)).filter((_data, index) => index % 4 === 0)
      this.lineChartData.datasets[1].data = (rawData.map((data:singleSensorData) => data.humidity)).filter((_data, index) => index % 4 === 0)
      this.lineChartData.labels = (rawData.map((data:singleSensorData) => new Date(data.date_time).getHours() + ':' + new Date(data.date_time).getMinutes())).filter((_data, index) => index % 4 === 0) as string[]
    } else {
      this.lineChartData.datasets[0].data = (rawData.map((data:singleSensorData) => data.temperature))
      this.lineChartData.datasets[1].data = (rawData.map((data:singleSensorData) => data.humidity))
      this.lineChartData.labels = (rawData.map((data:singleSensorData) => new Date(data.date_time).getHours() + ':' + new Date(data.date_time).getMinutes())) as string[]
    }
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Temperature',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      // {
      //   data: [],
      //   label: 'Humidity',
      //   backgroundColor: 'rgba(77,83,96,0.2)',
      //   borderColor: 'rgba(77,83,96,1)',
      //   pointBackgroundColor: 'rgba(77,83,96,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(77,83,96,1)',
      //   fill: 'origin',
      // },
      {
        data: [],
        label: 'Humidity',
        yAxisID: 'y1',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
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
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },

    plugins: {
      legend: { display: true },
      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'x',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              display: true,
              position: 'center',
              color: 'orange',
              content: 'LineAnno',
              font: {
                weight: 'bold',
              },
            },
          },
        ],
      },
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public hideOne(): void {
    const isHidden = this.chart?.isDatasetHidden(1);
    this.chart?.hideDataset(1, !isHidden);
  }

  public changeColor(): void {
    this.lineChartData.datasets[2].borderColor = 'green';
    this.lineChartData.datasets[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;

    this.chart?.update();
  }

  public changeLabel(): void {
    const tmp = this.newLabel;
    this.newLabel = this.lineChartData.datasets[2].label;
    this.lineChartData.datasets[2].label = tmp;

    this.chart?.update();
  }
}
