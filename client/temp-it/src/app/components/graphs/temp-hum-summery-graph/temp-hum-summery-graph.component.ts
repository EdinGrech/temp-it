import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsConfiguration } from 'ng2-charts';
import { NgChartsModule } from 'ng2-charts';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { SensorService } from 'src/app/services/user/sensor/sensor.service';
import { SensorReadingData } from 'src/app/interfaces/sensor/sensor';
import { CommonModule } from '@angular/common';
import { isMobile } from 'src/app/utils/mobile-detection';

@Component({
  selector: 'app-temp-hum-summery-graph',
  templateUrl: './temp-hum-summery-graph.component.html',
  styleUrls: ['./temp-hum-summery-graph.component.scss'],
  imports: [NgChartsModule, CommonModule],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
  ],
  standalone: true,
})
export class TempHumSummeryGraphComponent implements OnInit {
  @Input() userSensorId!: number;
  height!: number;

  constructor(private sensorService: SensorService) {
    Chart.register(Annotation);
  }

  ngOnInit(): void {
    if (isMobile(600)) {
      this.height = 300;
    } else {
      this.height = 100;
    }
    this.sensorService
      .getSensorLast24Hours(this.userSensorId)
      .subscribe((_data: SensorReadingData[]) => {
        this.rawToGraphData(_data);
        this.chart?.update();
      });
  }

  rawToGraphData(rawData: SensorReadingData[]): void {
    let dataSkipStep: number;
    if (isMobile(600)) {
      dataSkipStep = Math.round(rawData.length / (window.innerWidth / 26));
    } else {
      dataSkipStep = Math.round(rawData.length / (window.innerWidth / 30));
    }
    dataSkipStep = dataSkipStep === 0 ? 1 : dataSkipStep;

    const averages: SensorReadingData[] = [];
    let sumTemperature = 0;
    let sumHumidity = 0;
    let count = 0;

    for (let i = 0; i < rawData.length; i++) {
      const data = rawData[i];

      sumTemperature += data.temperature;
      sumHumidity += data.humidity;
      count++;

      if (i % dataSkipStep === 0 || i === rawData.length - 1) {
        // Calculate the average values for temperature and humidity
        const averageTemperature = sumTemperature / count;
        const averageHumidity = sumHumidity / count;

        // Push the last and average values into the new array
        averages.push({
          temperature: averageTemperature,
          humidity: averageHumidity,
          date_time: data.date_time, // Keep the date_time
        });

        sumTemperature = 0;
        sumHumidity = 0;
        count = 0;
      }
    }

    // Update the chart data with the calculated averages
    this.lineChartData.datasets[0].data = averages.map(
      (data) => data.temperature,
    );
    this.lineChartData.datasets[1].data = averages.map((data) => data.humidity);
    this.lineChartData.labels = averages.map((data, index) =>
      index === 0
        ? ''
        : new Date(data.date_time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
          }),
    ) as string[];
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
      //       annotation: {
      //         annotations: [
      //           {
      //             type: 'line',
      // //            scaleID: 'y1',
      //             yMin: 30,
      //             yMax: 30,
      //             borderColor: 'rgb(255, 99, 132)',
      //             borderWidth: 2,
      //             label: {
      //               display: true,
      //               position: 'center',
      //               color: 'orange',
      //               content: 'LineAnno',
      //               font: {
      //                 weight: 'bold',
      //               },
      //             },
      //           },
      //         ],
      //       },
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
}
