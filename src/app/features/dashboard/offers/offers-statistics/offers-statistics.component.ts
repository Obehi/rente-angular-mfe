import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Offers } from '@shared/models/offers';

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

  @Input() offersInfo: Offers;
  
  clientBankEffRateOptions: any;
  allBanksEffRateOptions: any;
  clientBankEffRateChart: Highcharts.Chart;
  allBankEffRateCharts: Highcharts.Chart;
  isSmallScreen: boolean;
  tips: string;

  ngOnInit() {
    if (this.offersInfo) {
      this.tips = this.offersInfo.tips;

      this.clientBankEffRateOptions = {
        chart: {
          type: 'column',
        },

        title: {
          text: 'Din rente i forhold til andre i din bank:',
          align: 'left',
          style: {
            fontWeight: 'bold'
          }
        },

        xAxis: {
          categories: ['Flere har', 'Median', 'Du har']
        },

        yAxis: {
          visible: false,
          title: {
            enabled: false
          },
          allowDecimals: false,
          // min: 0,
        },
        legend: {
          enabled: false
        },

        tooltip: {
          formatter() {
            return '<b>' + this.x + '</b><br/>' + this.y + '%';
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
            data: [], //[2.21, 2.62, 2.43],
            dataLabels: {
              enabled: true,
              rotation: 0,
              color: '#FFFFFF',
              align: 'center',
              format: '{point.y:.2f}%', // one decimal
              y: 10, // 10 pixels down from the top
              style: {
                fontSize: '24px'
              }
            }
          },

        ]
      };
      this.allBanksEffRateOptions = {
        chart: {
          type: 'column',
        },

        title: {
          text: 'Din rente i forhold til andre som deg, alle banker:',
          align: 'left',
          style: {
            fontWeight: 'bold'
          }
        },

        xAxis: {
          categories: ['Flere har', 'Median', 'Du har']
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
            return '<b>' + this.x + '</b><br/>' + this.y + '%';
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
            data: [], //[2.52, 2.65, 2.41],
            dataLabels: {
              enabled: true,
              rotation: 0,
              color: '#FFFFFF',
              align: 'center',
              format: '{point.y:.2f}%', // one decimal
              y: 10, // 10 pixels down from the top
              style: {
                fontSize: '24px'
              }
            }
          },

        ]
      };

      this.clientBankEffRateOptions.series[0].data = [
        this.offersInfo.bestPercentileEffectiveRateYourBank || 0,
        this.offersInfo.medianEffectiveRateYourBank || 0,
        this.offersInfo.totalEffectiveRate || 0
      ];

      this.allBanksEffRateOptions.series[0].data = [
        this.offersInfo.bestPercentileEffectiveRateAllBanks || 0,
        this.offersInfo.medianEffectiveRateAllBanks || 0,
        this.offersInfo.totalEffectiveRate || 0
      ];

      this.clientBankEffRateChart = Highcharts.chart('clientBankChart', this.clientBankEffRateOptions);
      this.allBankEffRateCharts = Highcharts.chart('allBanksChartChart', this.allBanksEffRateOptions);
      this.clientBankEffRateChart.setSize(null, 300);
      this.allBankEffRateCharts.setSize(null, 300);
    }
  }

}
