import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from '@services/snackbar.service';
import { AuthService } from '@services/remote-api/auth.service';
import { ROUTES_MAP } from '@config/routes-config';
import { CustomLangTextService } from '@services/custom-lang-text.service';

@Component({
  selector: 'rente-demo-login',
  templateUrl: './demo-login.component.html',
  styleUrls: ['./demo-login.component.scss']
})
export class DemoLoginComponent implements OnInit {
  userSessionId: string;
  guuids: string[] = [];
  public isLoading;

  constructor(
    private snackBar: SnackBarService,
    private router: Router,
    private authService: AuthService,
    public customLangTextService: CustomLangTextService
  ) {}

  ngOnInit(): void {
    // this.guuids.push('56bd15f7bcd54d1f916a1c88555af5c1')
    this.guuids.push('84fc762853994300b862f01b40340dbd');
    this.guuids.push('55e7db25029848d2a32dc7941ab0a2cf');
    this.guuids.push('416ca04f1919412b8ed1c5bbd72b029f');
  }

  goToChoice(optionId: number): void {
    const guid = this.guuids[optionId];

    this.isLoading = true;
    this.authService.loginForDemo(guid).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/' + ROUTES_MAP.offers]);
      },
      () => {
        this.isLoading = false;
        this.snackBar.openFailSnackBar(
          this.customLangTextService.getSnackBarErrorMessage(),
          2
        );
      }
    );
  }
}
