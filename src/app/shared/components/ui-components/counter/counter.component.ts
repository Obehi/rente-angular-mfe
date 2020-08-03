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
<<<<<<< HEAD
        this.totalOutstandingDebt =
          Math.round(res.totalOutstandingDebt / 1000) * 1000;
        this.combinedSavingsPotential =
          Math.round(res.combinedSavingsPotential / 10) * 10;
=======
        var totalOutstandingDebt = Math.round(res.totalOutstandingDebt / 1000);
        this.totalOutstandingoptions.startVal = totalOutstandingDebt;
        this.totalOutstandingDebt = totalOutstandingDebt;

        var combinedSavingsPotential = Math.round(res.combinedSavingsPotential / 10) * 10;
        this.combinedSavingsPotentialOptions.starVal = combinedSavingsPotential;
        this.combinedSavingsPotential = Math.round(res.combinedSavingsPotential / 10) * 10;
>>>>>>> parent of 4e5f4bb... Fix counter bug
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
