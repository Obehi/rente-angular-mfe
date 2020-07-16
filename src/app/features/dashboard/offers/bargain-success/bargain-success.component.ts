import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'rente-bargain-success',
  templateUrl: './bargain-success.component.html',
  styleUrls: ['./bargain-success.component.scss']
})
export class BargainSuccessComponent implements OnInit {
  
  public isErrorState = false

  constructor(private router: Router) {

    if(!window.history.state.fromChangeBankDialog) {
      this.router.navigate(['/dashboard/tilbud'])
    }
    if(!window.history.state.isError) {
      this.isErrorState = true
    } 
   }

  ngOnInit() {
  }

  public continue() {
    this.router.navigate(['/dashboard/tilbud'])
  }
}

