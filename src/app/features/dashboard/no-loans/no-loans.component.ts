import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rente-no-loans',
  templateUrl: './no-loans.component.html',
  styleUrls: ['./no-loans.component.scss']
})
export class NoLoansComponent implements OnInit, OnDestroy {
  public bankName: string;
  private routeQueryParamsSub: Subscription;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeQueryParamsSub = this.route.queryParams.subscribe(queryParams => {
      if (queryParams.bank) {
        this.bankName = queryParams.bank;
      }
    });
  }

  ngOnDestroy() {
    this.routeQueryParamsSub.unsubscribe();
  }

}
