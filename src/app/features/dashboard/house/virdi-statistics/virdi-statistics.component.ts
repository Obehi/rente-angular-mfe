import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';
import { LoansService } from '../../../../shared/services/remote-api/loans.service';
import { trigger, transition, keyframes, animate, style } from '@angular/animations';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'rente-virdi-statistics',
  templateUrl: './virdi-statistics.component.html',
  styleUrls: ['./virdi-statistics.component.scss'],
  animations: [
    trigger(
      'shakeAnimation',
      [
        transition(':enter', animate('200ms ease-in', keyframes([
          style({ transform: 'translate3d(-15px, 0, 0)' }),
          style({ transform: 'translate3d(0, 0, 0)' }),
          style({ transform: 'translate3d(7px, 0, 0)' }),
          style({ transform: 'translate3d(0, 0, 0)' })
        ]))),
      ]
    )
  ]
})
export class VirdiStatisticsComponent implements OnInit {
  @Output() statisticsLoaded = new EventEmitter();
  public isLoading: boolean;
  public priceDestributionSqm: any[] = [];
  public columnChartOptions: any;
  public lineChartOptions: any;
  public openMarketSalesHalfYear: number;

  constructor(
    private loansService: LoansService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.lineChartOptions = {
      chart: {
        type: 'area',
      },

      title: {
        text: ''
      },

      xAxis: {
        title: {
          enabled: 'bottom',
          text: 'NOK'
        },
        categories: []
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
        formatter() {
          return this.x + ': ' + this.y;
        }
      },

      plotOptions: {
      },

      series: [
        {
          type: 'area' as 'area',
          name: 'data',
          color: '#18BC9C',
          data: []
        }
      ]
    };

    this.columnChartOptions = {
      chart: {
        type: 'column',
      },

      title: {
        text: 'avg sqm: value'
      },

      xAxis: {
        title: {
          enabled: 'bottom',
          text: 'NOK'
        },
        categories: []
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
        formatter() {
          return '<b>' + this.x + '</b><br/>' +
            'Telle' + ': ' + this.y
        }
      },

      plotOptions: {
        column: {
          stacking: 'normal',
          groupPadding: 0,
          colorByPoint: true,
          colors: []
        }
      },

      series: [
        {
          type: 'column' as 'column',
          name: 'data',
          color: '#18BC9C',
          data: []
        },

      ]
    };
    this.loansService.getExtendedInfo().subscribe(extendedInfo => {
      this.isLoading = false;
      this.statisticsLoaded.emit();
      this.openMarketSalesHalfYear = extendedInfo.statistics.open_market_sales_6_months;
      extendedInfo.statistics.price_distribution_sqm.forEach(element => {
        this.priceDestributionSqm.push({ from: element.from, to: element.to });
        this.columnChartOptions.series[0].data.push(element.count);
        this.columnChartOptions.title.text = `Din kvadratmeter pris: ${extendedInfo.statistics.average_sqm_price} NOK`;
        this.lineChartOptions.title.text = `${extendedInfo.indexHistory.area}`;
        if (extendedInfo.statistics.average_sqm_price >= element.from && extendedInfo.statistics.average_sqm_price <= element.to) {
          this.columnChartOptions.plotOptions.column.colors.push('#2b3e50');
        } else {
          this.columnChartOptions.plotOptions.column.colors.push('#18BC9C');
        }
      });
      this.columnChartOptions.xAxis.categories = [...this.createThousandsCategories(this.priceDestributionSqm)];
      extendedInfo.indexHistory.data.forEach(element => {
        this.lineChartOptions.series[0].data.unshift(element.index_value);
        this.lineChartOptions.xAxis.categories.unshift(element.date);
      });
      Highcharts.chart('columnChart', this.columnChartOptions);
      Highcharts.chart('lineChart', this.lineChartOptions);
    }, err => {
      this.isLoading = false;
    });
  }

  private convertThousands(value) {
    return Math.floor(value / 1000) + 'K';
  }

  private createThousandsCategories(arr: any[]) {
    return arr.map(item => {
      if (item.to !== undefined) {
        if (item.from > 1000) {
          return this.convertThousands(item.from) + '-' + this.convertThousands(item.to);
        } else {
          return '0' + '-' + this.convertThousands(item.to);
        }
      } else {
        return '>' + this.convertThousands(item.from);
      }
    });
  }

}
