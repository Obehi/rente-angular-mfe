import { Component, OnInit } from "@angular/core";
import { LoansService } from "@services/remote-api/loans.service";

@Component({
  selector: "rente-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.scss"]
})
export class CounterComponent implements OnInit {
  totalOutstandingDebt: number;
  combinedSavingsPotential: number;
  interval: any;

  constructor(private loansService: LoansService) {}

  ngOnInit(): void {
    this.loansService.getLoanStatistics().subscribe(res => {
      if (res) {
        this.totalOutstandingDebt =
          Math.round(res.totalOutstandingDebt / 1000) * 1000;
        this.combinedSavingsPotential =
          Math.round(res.combinedSavingsPotential / 10) * 10;
        this.setupRefresh();
      }
    });
  }

  setupRefresh() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.totalOutstandingDebt += 1000;
      this.combinedSavingsPotential += 30;
    }, 2000);
  }
}
