import { AuthService } from '@services/remote-api/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rente-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
  }

}
