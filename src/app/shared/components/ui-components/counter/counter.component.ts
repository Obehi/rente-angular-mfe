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
  public totalOutstandingoptions = {
    startVal: 0,
    separator: ' '
  }

  public combinedSavingsPotentialOptions = {
    starVal: 0,
    separator: ' '
  }
  constructor(private loansService: LoansService) {}

  ngOnInit(): void {
    this.loansService.getLoanStatistics().subscribe(res => {
      if (res) {
        var totalOutstandingDebt = Math.round(res.totalOutstandingDebt / 1000);
        this.totalOutstandingoptions.startVal = totalOutstandingDebt;
        this.totalOutstandingDebt = totalOutstandingDebt;

        var combinedSavingsPotential = Math.round(res.combinedSavingsPotential / 10) * 10;
        this.combinedSavingsPotentialOptions.starVal = combinedSavingsPotential;
        this.combinedSavingsPotential = Math.round(res.combinedSavingsPotential / 10) * 10;
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
