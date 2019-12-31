import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { LoansService, AddressDto } from '../../../../shared/services/remote-api/loans.service';
import { trigger, transition, keyframes, animate, style } from '@angular/animations';
import { SnackBarService } from '@services/snackbar.service';

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

  @Input() address:AddressDto;

  isLoading: boolean;
  priceDestributionSqm: any[] = [];
  columnChartOptions: any;
  lineChartOptions: any;
  openMarketSalesHalfYear: number;
  indexArea: string;

  constructor(
    private loansService: LoansService,
    private snackBar: SnackBarService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.lineChartOptions = {
      chart: {
        type: 'area',
      },

      title: {
        text: '',
        style: {
          fontFamily: 'Lato'
        }
      },

      xAxis: {
        title: {
          enabled: 'bottom'
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
      ],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            title: {
              style: {
                fontFamily: 'Lato',
                fontSize: '16px'
              }
            }
          }
        }]
      }
    };

    this.columnChartOptions = {
      chart: {
        type: 'column',
      },

      title: {
        text: '',
        style: {
          fontFamily: 'Lato'
        }
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
            'Antall' + ': ' + this.y;
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

      ],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            title: {
              style: {
                fontFamily: 'Lato',
                fontSize: '16px'
              }
            }
          }
        }]
      }
    };

    this.loansService.getAddressStatistics(this.address.id).subscribe(extendedInfo => {
      this.isLoading = false;
      this.openMarketSalesHalfYear = extendedInfo.statistics.open_market_sales_6_months;
      this.indexArea = extendedInfo.indexHistory.area;
      extendedInfo.statistics.price_distribution_sqm.forEach(element => {
        this.priceDestributionSqm.push({ from: element.from, to: element.to });
        this.columnChartOptions.series[0].data.push(element.count);
        this.columnChartOptions.title.text = `Din kvadratmeterpris: ${extendedInfo.statistics.average_sqm_price} NOK`;
        this.lineChartOptions.title.text = `Prisutvikling ${extendedInfo.indexHistory.area}`;
        if (extendedInfo.statistics.average_sqm_price >= element.from && extendedInfo.statistics.average_sqm_price <= element.to) {
          this.columnChartOptions.plotOptions.column.colors.push('#2b3e50');
        } else {
          this.columnChartOptions.plotOptions.column.colors.push('#18BC9C');
        }
      });
      this.columnChartOptions.xAxis.categories = [...this.createThousandsCategories(this.priceDestributionSqm)];
      const BreakException = {};
      try {
        extendedInfo.indexHistory.data.forEach((element, index) => {
          if (index >= 39) {
            throw BreakException;
          } else {
            this.lineChartOptions.xAxis.categories.unshift(element.date);
            this.lineChartOptions.series[0].data.unshift(element.index_value);
          }
        });
      } catch (e) {
        if (e !== BreakException) {
          throw e;
        }
      }

      Highcharts.chart(`columnChartAddress${this.address.id}`, this.columnChartOptions);
      Highcharts.chart(`lineChartAddress${this.address.id}`, this.lineChartOptions);
    }, err => {
      this.notifError();
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

  notifError() {
    this.snackBar.openFailSnackBar('Feil ved lasting av statistikkdata', 10);
  }

}
