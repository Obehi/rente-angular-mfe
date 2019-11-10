import { Component, OnInit, Input, HostListener } from '@angular/core';
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
export class OffersStatisticsComponent {

  @Input()
  public get offersInfo(): Offers {
    return this._offersInfo;
  }
  public set offersInfo(value: Offers) {
    this._offersInfo = value;
    this.hasClientBankData = value &&
      value.bestPercentileEffectiveRateYourBank > 0 &&
      value.medianEffectiveRateYourBank > 0;
    this.hasOthersBankData = value &&
      value.bestPercentileEffectiveRateAllBanks > 0 &&
      value.medianEffectiveRateAllBanks > 0;
    this.tips = value && value.tips;
  }
  
  _offersInfo: Offers;
  clientBankEffRateOptions: any;
  allBanksEffRateOptions: any;
  clientBankEffRateChart: Highcharts.Chart;
  allBankEffRateCharts: Highcharts.Chart;
  tips: string;
  hasClientBankData = true;
  hasOthersBankData = true;
  clientBankChartId = 'clientBankChartId';
  allBanksChartChartId = 'allBanksChartChartId';

  get chartTitleMargin() {
    return window.innerWidth <= 991 ? -80 : -10;
  }

  ngAfterViewInit() {
    if (this.offersInfo) {
      if (this.hasClientBankData) {
        this.clientBankEffRateOptions = this.getClientBankChartOptions();
        this.clientBankEffRateOptions.series[0].data = [
          this.offersInfo.bestPercentileEffectiveRateYourBank || 0,
          this.offersInfo.medianEffectiveRateYourBank || 0,
          this.offersInfo.totalEffectiveRate || 0
        ];
        this.clientBankEffRateChart = Highcharts.chart(this.clientBankChartId, this.clientBankEffRateOptions);
        this.clientBankEffRateChart.setSize(null, 300);
      }
      if (this.hasOthersBankData) {
        this.allBanksEffRateOptions = this.getOtherBanksChartOptions();
        this.allBanksEffRateOptions.series[0].data = [
          this.offersInfo.bestPercentileEffectiveRateAllBanks || 0,
          this.offersInfo.medianEffectiveRateAllBanks || 0,
          this.offersInfo.totalEffectiveRate || 0
        ];
        this.allBankEffRateCharts = Highcharts.chart(this.allBanksChartChartId, this.allBanksEffRateOptions);
        this.allBankEffRateCharts.setSize(null, 300);
      }
    }
  }

  getClientBankChartOptions() {
    let opt = {
      chart: {
        type: 'column',
      },

      title: {
        text: 'Din rente i forhold til andre i din bank:',
        align: 'left',
        margin: this.chartTitleMargin,
        style: {
          fontWeight: 'bold'
        }
      },

      xAxis: {
        categories: ['De med lavest rente', 'Snitt-kunden', 'Du har'],
        labels: {
          style: {
            fontSize: '14px',
          }
        }
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
        enabled: false,
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
              fontSize: '24px',
              textOutline: false
            }
          }
        },
      ]
    };
    return opt;
  }

  getOtherBanksChartOptions() {
    let opt = {
      chart: {
        type: 'column',
      },

      title: {
        text: 'Din rente i forhold til andre i alle banker:',
        align: 'left',
        margin: this.chartTitleMargin,
        style: {
          fontWeight: 'bold'
        }
      },

      xAxis: {
        categories: ['De med lavest rente', 'Snitt-kunden', 'Du har'],
        labels: {
          style: {
            fontSize: '14px',
          }
        }
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
        enabled: false,
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
              fontSize: '24px',
              textOutline: false
            }
          }
        },

      ]
    };
    return opt;
  }

}
