import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Offers, BankStatisticItem } from '@shared/models/offers';
import { MatTabChangeEvent } from '@angular/material';

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
  styleUrls: ['./offers-statistics.component.scss'],
})
export class OffersStatisticsComponent implements AfterViewInit, OnInit {
  @Input()
  public get offersInfo(): Offers {
    return this._offersInfo;
  }
  public set offersInfo(value: Offers) {
    this._offersInfo = value;
    this.hasClientBankData = false
    this.hasOthersBankData = false

    this.hasClientBankData =
      value &&
      value.bankStatistics.clientBankStatistics.bestPercentileEffectiveRate > 0 &&
      value.bankStatistics.allBanksStatistics.medianEffectiveRate > 0;
    this.hasOthersBankData =
      value &&
      value.bankStatistics.allBanksStatistics.bestPercentileEffectiveRate  > 0 &&
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

  get ageSegment() {
    return this.offersInfo.bankStatistics.age >= 34 ? "over 34 år" : "under 34 år";
  }

  get totalOutstandingDebtSegment() {
    let text = ""
    let totalOutstandingDebt = this.offersInfo.bankStatistics.totalOutstandingDebt;

    if(totalOutstandingDebt < 2000000) {
      text = "mindre enn 2 mill. i lån"
    } 
    else if(totalOutstandingDebt >= 2000000 && totalOutstandingDebt < 4000000) {
      text = " 2-4 mill. i lån"
    }
    else if(totalOutstandingDebt >= 4000000) {
      text = "over 4 mill. i lån"
    }  
   return text 
  }

  get ltvSegment() {
    let text = ""
    let ltv = this.offersInfo.bankStatistics.ltv;
    if(ltv <= 0.6) {
      text = "under 60%"
    }
    else if(ltv > 0.6 && ltv <= 0.75){
      text = "60-75%"
    }
    else if(ltv > 0.75) {
      text = "over 75%"
    }
    return text;
  }

  get chartTitleMargin() {
    return window.innerWidth <= 991 ? 0 : -10;
  }

  ngOnInit() {
    this.haveAllBankData = this.hasOthersBankData && this.hasClientBankData 
      && ((this.allBankData.segmentedData && this.clientBankData.segmentedData) 
      || (!this.allBankData.segmentedData && !this.clientBankData.segmentedData))
  }

  ngAfterViewInit() {
    if (this.offersInfo) {
      console.log("this.clientBankData")
      console.log(this.clientBankData)

      if (this.hasClientBankData) {
        this.clientBankEffRateOptions = this.ChartOptions();
        this.clientBankEffRateOptions.series[0].data = [
         
          this.offersInfo.totalEffectiveRate || 0,
          this.offersInfo.bankStatistics.clientBankStatistics.medianEffectiveRate || 0,
          this.offersInfo.bankStatistics.clientBankStatistics.bestPercentileEffectiveRate || 0
        ];

        // Only show clientbank graph when everything is false or true 
        if(this.clientBankData.segmentedData == this.allBankData.segmentedData )
          this.clientBankEffRateChart = Highcharts.chart(
          this.clientBankChartId,
          this.clientBankEffRateOptions
        );
      
        /* this.clientBankEffRateChart.setSize(null, 200); */
      }

      if (this.hasOthersBankData) {
        this.allBanksEffRateOptions = this.ChartOptions();
        this.allBanksEffRateOptions.series[0].data = [
          this.offersInfo.totalEffectiveRate || 0,
          this.offersInfo.bankStatistics.allBanksStatistics.medianEffectiveRate || 0,
          this.offersInfo.bankStatistics.allBanksStatistics.bestPercentileEffectiveRate || 0
        ];

        this.allBankEffRateCharts = Highcharts.chart(
          this.allBanksChartChartId,
          this.allBanksEffRateOptions
        );
        
        /* this.allBankEffRateCharts.setSize(null, 200); */
      }   
    }
  }

  onRbChange(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.showAllBanks = false;
    } else {
      this.showAllBanks = true;
    }
  }

  ChartOptions() {
    let opt = {
      chart: {
        type: 'column',
        spacingLeft: 0,
        spacingRight: 0,
        margin: [0, 0, 25, 0],
        height: this.haveAllBankData ? 170 : 230,
        borderRadius: 20,
        backgroundColor:'#162537'
      },

      title: {
        text: null, //'Din rente i forhold til andre i din bank:',
        align: 'left',

        style: {
          fontWeight: 'bold'
        }
      },

      xAxis: { 
        categories: ['Du har', 'Snitt-kunden', 'De med lavest rente'],
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
          text: null,
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
          colors: ['#E13322', '#183A63', '#183A63'],
          borderRadius: 5,
          borderWidth: 0
        }
      },

      series: [
        {
          type: 'column' as 'column',
          name: 'data',

          data: [], //[2.21, 2.62, 2.43],
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

  getOtherBanksChartOptions() {
    let opt = {
      chart: {
        type: 'column',
        backgroundColor:'#162537'
      },

      title: {
        text: null, //'Din rente i forhold til andre i alle banker:',
        align: 'left',
        margin: this.chartTitleMargin,
        style: {
          fontWeight: 'bold'
        }
      },

      xAxis: {
        categories: ['Du har', 'Snitt-kunden', 'De med lavest rente'],
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
          type: 'column' as 'column',
          name: 'data',

          data: [], //[2.21, 2.62, 2.43],
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
