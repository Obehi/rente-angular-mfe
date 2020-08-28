import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ROUTES_MAP } from '@config/routes-config';
@Component({
  selector: "rente-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  public routes = ROUTES_MAP
  constructor(public router: Router) {}

  ngOnInit() {}
}
