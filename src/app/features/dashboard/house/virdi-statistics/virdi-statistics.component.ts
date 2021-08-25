import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';
import {
  LoansService,
  AddressDto
} from '../../../../shared/services/remote-api/loans.service';
import { SnackBarService } from '@services/snackbar.service';
import { MatTabChangeEvent } from '@angular/material';
import { MessageBannerService } from '@services/message-banner.service';
import { getAnimationStyles } from '@shared/animations/animationEnums';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

declare let require: any;
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
    trigger('fade', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('0.2s 1s ease-in', style({ opacity: '1' }))
      ])
    ]),
    trigger('stretch', [
      transition(':enter', [
        style({ height: 0 }),
        animate('0.5s ease-in', style({ height: '532px' }))
      ])
    ]),
    trigger('slide', [
      state(
        'open',
        style({
          opacity: 1
        })
      ),
      state(
        'close',
        style({
          opacity: 0
        })
      ),
      transition('* => open', [animate('0.3s ease-in', style({ opacity: 1 }))]),
      transition('* => close', [
        animate('0.3s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class VirdiStatisticsComponent implements OnInit {
  @Input() address: AddressDto;
  @Output() eventEmitter = new EventEmitter<any>();

  isLoading: boolean;
  priceDestributionSqm: any[] = [];
  columnChartOptions: any;
  lineChartOptions: any;
  openMarketSalesHalfYear: number;
  indexArea: string;
  showPriceDevelopment: boolean;
  averageSqmPrice: string;
  area: string;
  animationType = getAnimationStyles();

  constructor(
    private loansService: LoansService,
    private snackBar: SnackBarService,
    private messageService: MessageBannerService
  ) {
    this.showPriceDevelopment = false;
  }

  onRbChange(event: MatTabChangeEvent): void {
    if (event.index === 1) {
      this.showPriceDevelopment = true;
    } else {
      this.showPriceDevelopment = false;
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.lineChartOptions = {
      chart: {
        type: 'area',
        height: 300
      },

      title: {
        text: '',
        style: {
          fontFamily: 'roboto'
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
          enabled: false
        },
        allowDecimals: false
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

      plotOptions: {},

      series: [
        {
          type: 'area' as const,
          name: 'data',
          color: '#18BC9C',
          data: []
        }
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              title: {
                style: {
                  fontFamily: 'roboto',
                  fontSize: '16px'
                }
              }
            }
          }
        ]
      }
    };

    this.columnChartOptions = {
      chart: {
        type: 'column',
        height: 300
      },

      title: {
        text: '',
        style: {
          fontFamily: 'roboto'
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
          enabled: false
        },
        allowDecimals: false
        // min: 0,
      },
      legend: {
        enabled: false
      },

      tooltip: {
        formatter() {
          return '<b>' + this.x + '</b><br/>' + 'Antall' + ': ' + this.y;
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
          type: 'column' as const,
          name: 'data',
          color: '#CFD4D7',
          data: []
        }
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              title: {
                style: {
                  fontFamily: 'roboto',
                  fontSize: '16px'
                }
              }
            }
          }
        ]
      }
    };

    this.loansService.getAddressStatistics(this.address.id).subscribe(
      (extendedInfo) => {
        this.isLoading = false;
        if (extendedInfo.indexHistory && extendedInfo.indexHistory.area) {
          this.indexArea = extendedInfo.indexHistory.area;
        }
        if (extendedInfo.statistics) {
          this.openMarketSalesHalfYear =
            extendedInfo.statistics.open_market_sales_6_months;
          if (
            extendedInfo.statistics.price_distribution_sqm &&
            extendedInfo.statistics.price_distribution_sqm.length > 0
          ) {
            extendedInfo.statistics.price_distribution_sqm.forEach(
              (element) => {
                this.priceDestributionSqm.push({
                  from: element.from,
                  to: element.to
                });
                this.columnChartOptions.series[0].data.push(element.count);

                this.averageSqmPrice =
                  extendedInfo.statistics.average_sqm_price;
                this.area = extendedInfo.indexHistory.area;

                if (
                  extendedInfo.statistics.average_sqm_price >= element.from &&
                  extendedInfo.statistics.average_sqm_price <= element.to
                ) {
                  this.columnChartOptions.plotOptions.column.colors.push(
                    '#18BC9C'
                  );
                } else {
                  this.columnChartOptions.plotOptions.column.colors.push(
                    '#CFD4D7'
                  );
                }
              }
            );
          }
        }
        this.columnChartOptions.xAxis.categories = [
          ...this.createThousandsCategories(this.priceDestributionSqm)
        ];
        const BreakException = {};
        if (extendedInfo.indexHistory && extendedInfo.indexHistory.data) {
          try {
            extendedInfo.indexHistory.data.forEach((element, index) => {
              if (index >= 39) {
                throw BreakException;
              } else {
                this.lineChartOptions.xAxis.categories.unshift(
                  element.date.split('-', 1)[0]
                );
                this.lineChartOptions.series[0].data.unshift(
                  element.index_value
                );
              }
            });
          } catch (e) {
            if (e !== BreakException) {
              throw e;
            }
          }
        }

        Highcharts.chart(
          `columnChartAddress${this.address.id}`,
          this.columnChartOptions
        );
        Highcharts.chart(
          `lineChartAddress${this.address.id}`,
          this.lineChartOptions
        );
      },
      () => {
        this.notifError();
        this.isLoading = false;
      }
    );
  }

  private convertThousands(value) {
    return Math.floor(value / 1000) + 'K';
  }

  private createThousandsCategories(arr: any[]) {
    return arr.map((item) => {
      if (item.to !== undefined) {
        if (item.from > 1000) {
          return (
            this.convertThousands(item.from) +
            '-' +
            this.convertThousands(item.to)
          );
        } else {
          return '0' + '-' + this.convertThousands(item.to);
        }
      } else {
        return '>' + this.convertThousands(item.from);
      }
    });
  }

  notifError(): void {
    this.messageService.setView(
      'Feil ved lasting av statistikkdata',
      5000,
      this.animationType.DROP_DOWN_UP,
      'error',
      window
    );
  }
}
