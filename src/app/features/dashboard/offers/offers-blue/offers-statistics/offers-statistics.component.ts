import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Offers, BankStatisticItem } from '@shared/models/offers';
import { MatTabChangeEvent } from '@angular/material';
import { EnvService } from '@services/env.service';
declare let require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'rente-offers-statistics-blue',
  templateUrl: './offers-statistics.component.html',
  styleUrls: ['./offers-statistics.component.scss']
})
export class OffersStatisticsComponentBlue implements AfterViewInit, OnInit {
  @Input() userRateColor;
  @Input()
  public get offersInfo(): Offers {
    return this._offersInfo;
  }

  public set offersInfo(value: Offers) {
    this._offersInfo = value;
    this.hasClientBankData = false;
    this.hasOthersBankData = false;

    this.hasClientBankData =
      value &&
      value.bankStatistics.clientBankStatistics.bestPercentileEffectiveRate >
        0 &&
      value.bankStatistics.allBanksStatistics.medianEffectiveRate > 0;
    this.hasOthersBankData =
      value &&
      value.bankStatistics.allBanksStatistics.bestPercentileEffectiveRate > 0 &&
      value.bankStatistics.allBanksStatistics.medianEffectiveRate > 0;

    this.clientBankData = value && value.bankStatistics.clientBankStatistics;
    this.allBankData = value && value.bankStatistics.allBanksStatistics;
  }

  _offersInfo: Offers;
  clientBankEffRateOptions: any;
  allBanksEffRateOptions: any;
  clientBankEffRateChart: Highcharts.Chart;
  allBankEffRateCharts: Highcharts.Chart;
  hasClientBankData = true;
  hasOthersBankData = true;
  clientBankChartId = 'clientBankChartId';
  allBanksChartChartId = 'allBanksChartChartId';
  showAllBanks = false;
  clientBankData: BankStatisticItem;
  allBankData: BankStatisticItem;
  haveAllBankData = false;

  get ageSegment(): string {
    return this.offersInfo.bankStatistics.age >= 34
      ? this.envService.isNorway()
        ? 'over 34 år'
        : 'över 34 år'
      : 'under 34 år';
  }

  get totalOutstandingDebtSegment(): string {
    let text = '';
    const totalOutstandingDebt = this.offersInfo.bankStatistics
      .totalOutstandingDebt;

    if (totalOutstandingDebt < 2000000) {
      text = this.envService.isNorway()
        ? 'mindre enn 2 mill. i lån'
        : 'mindre än 2 milj. i lån';
    } else if (
      totalOutstandingDebt >= 2000000 &&
      totalOutstandingDebt < 4000000
    ) {
      text = this.envService.isNorway()
        ? ' 2-4 mill. i lån'
        : ' 2-4 milj. i lån';
    } else if (totalOutstandingDebt >= 4000000) {
      text = this.envService.isNorway()
        ? 'over 4 mill. i lån'
        : 'över 4 milj. i lån';
    }
    return text;
  }

  get ltvSegment(): string {
    let text = '';
    const ltv = this.offersInfo.bankStatistics.ltv;
    if (ltv <= 0.6) {
      text = 'under 60%';
    } else if (ltv > 0.6 && ltv <= 0.75) {
      text = '60-75%';
    } else if (ltv > 0.75) {
      text = this.envService.isNorway() ? 'over 75%' : 'över 75%';
    }
    return text;
  }

  get chartTitleMargin(): number {
    return window.innerWidth <= 991 ? 0 : -10;
  }

  constructor(public envService: EnvService) {}

  ngOnInit(): void {
    this.haveAllBankData =
      this.hasOthersBankData &&
      this.hasClientBankData &&
      ((this.allBankData.segmentedData && this.clientBankData.segmentedData) ||
        (!this.allBankData.segmentedData &&
          !this.clientBankData.segmentedData));
  }

  ngAfterViewInit(): void {
    if (this.offersInfo) {
      if (this.hasClientBankData) {
        this.clientBankEffRateOptions = this.ChartOptions();
        this.clientBankEffRateOptions.series[0].data = [
          this.offersInfo.totalEffectiveRate || 0,
          this.offersInfo.bankStatistics.clientBankStatistics
            .medianEffectiveRate || 0,
          this.offersInfo.bankStatistics.clientBankStatistics
            .bestPercentileEffectiveRate || 0
        ];

        // Only show clientbank graph when everything is false or true
        if (
          this.clientBankData.segmentedData === this.allBankData.segmentedData
        )
          this.clientBankEffRateChart = Highcharts.chart(
            this.clientBankChartId,
            this.clientBankEffRateOptions
          );
      }

      if (this.hasOthersBankData) {
        this.allBanksEffRateOptions = this.ChartOptions();
        this.allBanksEffRateOptions.series[0].data = [
          this.offersInfo.totalEffectiveRate || 0,
          this.offersInfo.bankStatistics.allBanksStatistics
            .medianEffectiveRate || 0,
          this.offersInfo.bankStatistics.allBanksStatistics
            .bestPercentileEffectiveRate || 0
        ];

        this.allBankEffRateCharts = Highcharts.chart(
          this.allBanksChartChartId,
          this.allBanksEffRateOptions
        );

        setTimeout(() => {
          this.allBankEffRateCharts.inverted = false;
        }, 1000);
        /* this.allBankEffRateCharts.setSize(null, 200); */
      }
    }
  }

  onRbChange(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this.showAllBanks = false;
    } else {
      this.showAllBanks = true;
    }
  }

  ChartOptions(): any {
    const opt = {
      chart: {
        type: 'column',
        spacingLeft: 0,
        spacingRight: 0,
        margin: [0, 0, 25, 0],
        height: this.haveAllBankData ? 200 : 230,
        borderRadius: 20,
        backgroundColor: '#162537'
      },

      title: {
        text: null, // 'Din rente i forhold til andre i din bank:',
        align: 'left',

        style: {
          fontWeight: 'bold'
        }
      },

      xAxis: {
        categories: [
          'Du har',
          this.envService.isNorway() ? 'Snitt-kunden' : 'Snittanvändare',
          this.envService.isNorway()
            ? 'De med lavest rente'
            : 'De med lägst ränta'
        ],
        labels: {
          style: {
            fontSize: '12px',
            color: 'white'
          }
        },
        lineWidth: 0
      },
      yAxis: {
        visible: false,
        title: {
          text: null
        },
        allowDecimals: false
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
          colors: [this.userRateColor, '#183A63', '#183A63'],
          borderRadius: 5,
          borderWidth: 0
        }
      },

      series: [
        {
          type: 'column' as const,
          name: 'data',

          data: [], // [2.21, 2.62, 2.43],
          dataLabels: {
            enabled: true,
            rotation: 0,

            align: 'center',
            verticalAlign: 'bottom',
            format: '{point.y:.2f}%', // one decimal
            y: 0, // 10 pixels down from the top
            style: {
              fontSize: '26px',
              textOutline: false,
              color: 'contrast'
            }
          }
        }
      ]
    };
    return opt;
  }

  getOtherBanksChartOptions(): any {
    const opt = {
      chart: {
        type: 'column',
        backgroundColor: '#162537',
        animation: true
      },

      title: {
        text: null, // 'Din rente i forhold til andre i alle banker:',
        align: 'left',
        margin: this.chartTitleMargin,
        style: {
          fontWeight: 'bold'
        }
      },

      xAxis: {
        categories: [
          'Du har',
          this.envService.isNorway() ? 'Snitt-kunden' : 'Snittanvändare',
          this.envService.isNorway()
            ? 'De med lavest rente'
            : 'De med lägst ränta'
        ],
        labels: {
          style: {
            fontSize: '14px',
            color: 'white'
          }
        }
      },

      yAxis: {
        title: {
          enabled: false
        },
        allowDecimals: false
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
          colors: ['#112639', '#E7E9EB', '#D1F2EB'],
          borderRadius: 4
        }
      },

      series: [
        {
          type: 'column' as const,
          name: 'data',

          data: [], // [2.21, 2.62, 2.43],
          dataLabels: {
            enabled: true,
            rotation: 0,

            align: 'center',
            verticalAlign: 'bottom',
            format: '{point.y:.2f}%', // one decimal
            y: 0, // 10 pixels down from the top
            style: {
              fontSize: '26px',
              textOutline: false,
              color: 'contrast'
            }
          }
        }
      ]
    };
    return opt;
  }
}
