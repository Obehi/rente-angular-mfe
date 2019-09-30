import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'rente-virdi-statistics',
  templateUrl: './virdi-statistics.component.html',
  styleUrls: ['./virdi-statistics.component.scss']
})
export class VirdiStatisticsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    Highcharts.chart('columnChart', this.columnChartOptions);
    Highcharts.chart('lineChart', this.lineChartOptions);
  }

  public columnChartOptions: any = {
    chart: {
      type: 'column',
    },

    title: {
      text: 'avg sqm :'
    },

    xAxis: {
      title: {
        enabled: "bottom",
        text: "NOK"
      },
      plotLines: [{
        color: 'red',
        width: 2,
        value: 10000,
        label: {
            text: 'Plot line',
            align: 'right',
            x: -10
        }
    }],
      categories: ["0-60K", "60-70K", "70-80K", "80-90K", "90-100K", "100-110K", ">110K"]
    },

    yAxis: {
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
      formatter: function () {
        return '<b>' + this.x + '</b><br/>' +
          'in ' + this.series.name + ': ' + this.y + '<br/>' +
          'Total: ' + this.point.stackTotal;
      }
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        groupPadding: 0,
      }
    },

    series: [
      {
        type: 'column' as "column",
        name: 'data',
        color: '#18BC9C',
        data: [9, 51, 153, 255, 162, 135, 123]
      },

    ]
  }
  public lineChartOptions: any = {
    chart: {
      type: 'area',
    },

    title: {
      text: ''
    },

    xAxis: {
      title: {
        enabled: "bottom",
        text: "NOK"
      },
      categories: ["2015", "2016", "2017", "2018", "2019"]
    },

    yAxis: {
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
      formatter: function () {
        return '<b>' + this.x + '</b><br/>' +
          'in ' + this.series.name + ': ' + this.y + '<br/>' +
          'Total: ' + this.point.stackTotal;
      }
    },

    plotOptions: {
      series: {
        pointInterval: 0.5
      }
    },

    series: [
      {
        type: 'area' as "area",
        name: 'data',
        color: '#18BC9C',
        data: [550, 560, 670, 680, 790, 900, 1110, 1220, 1530]
      }
    ]
  }

}
