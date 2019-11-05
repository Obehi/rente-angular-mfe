import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'rente-offers-statistics',
  templateUrl: './offers-statistics.component.html',
  styleUrls: ['./offers-statistics.component.scss']
})
export class OffersStatisticsComponent implements OnInit {
  public bankChartOptions: any;
  public groupChartOptions: any;
  public bankChart: Highcharts.Chart;
  public groupChart: Highcharts.Chart;
  public isSmallScreen: boolean;
  public tip: string;
  constructor() { }

  ngOnInit() {
    this.tip = 'some text some text some text some text some text some text some text'
    this.bankChartOptions = {
      chart: {
        type: 'column',
      },

      title: {
        text: 'Din rente i farhold til andre i din bank:',
        align: 'left'
      },

      xAxis: {
        categories: ['Flere Har', 'Median', 'Du har']
      },

      yAxis: {
        visible: false,
        title: {
          enabled: false,
        },
        allowDecimals: false,
        // min: 0,
      },
      legend: {
        enabled: false
      },

      tooltip: {
        formatter() {
          return '<b>' + this.x + '</b><br/>' +
            this.y + '%';
        }
      },

      plotOptions: {
        column: {
          stacking: 'normal',
          groupPadding: 0,
          colorByPoint: true,
          colors: ['#1abc9c', '#7f7f7f', '#2d3e50'],
          borderRadius: 4
        }
      },

      series: [
        {
          type: 'column' as 'column',
          name: 'data',
          color: '#18BC9C',
          data: [2.21, 2.62, 2.43],
          dataLabels: {
            enabled: true,
            rotation: 0,
            color: '#FFFFFF',
            align: 'center',
            format: '{point.y:.2f}%', // one decimal
            y: 10, // 10 pixels down from the top
          }
        },

      ]
    };
    this.groupChartOptions = {
      chart: {
        type: 'column',
      },

      title: {
        text: 'Din rente i forhold til andre som deg, alle banker:',
        align: 'left'
      },

      xAxis: {
        categories: ['Flere Har', 'Median', 'Du har']
      },

      yAxis: {
        visible: false,
        title: {
          enabled: false,
        },
        allowDecimals: false,
        // min: 0,
      },
      legend: {
        enabled: false
      },

      tooltip: {
        formatter() {
          return '<b>' + this.x + '</b><br/>' +
            this.y + '%';
        }
      },

      plotOptions: {
        column: {
          stacking: 'normal',
          groupPadding: 0,
          colorByPoint: true,
          colors: ['#1abc9c', '#7f7f7f', '#2d3e50'],
          borderRadius: 4
        }
      },

      series: [
        {
          type: 'column' as 'column',
          name: 'data',
          color: '#18BC9C',
          data: [2.52, 2.65, 2.41],
          dataLabels: {
            enabled: true,
            rotation: 0,
            color: '#FFFFFF',
            align: 'center',
            format: '{point.y:.2f}%', // one decimal
            y: 10, // 10 pixels down from the top
          }
        },

      ]
    };
    this.bankChart = Highcharts.chart('bankChart', this.bankChartOptions);
    this.groupChart = Highcharts.chart('groupChart', this.groupChartOptions);
    this.bankChart.setSize(null, 300);
    this.groupChart.setSize(null, 300);
  }


}
