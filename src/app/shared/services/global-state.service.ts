import { Injectable } from '@angular/core';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { delay, filter, map, scan, share, switchMap } from 'rxjs/operators';
import { ScriptService } from '@services/script.service';
import { BreakpointObserver } from '@angular/cdk/layout';
@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private showFooter: Subject<boolean>;
  private notificationOffers = new BehaviorSubject<number>(0);
  private notificationMortgages = new BehaviorSubject<number>(0);
  private notificationHouses = new BehaviorSubject<number>(0);
  private notificationProfile = new Subject<number>();
  private isDashboard = new BehaviorSubject<boolean>(false);
  private isSignicatLogin$ = new BehaviorSubject<boolean>(false);
  private isUnder992$ = new Observable<boolean>();
  private isMobile$ = new Observable<boolean>();

  public isScriptLoaded$ = new BehaviorSubject(false);

  private routeNavigationEnd$: Observable<any> = this.route.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    share()
  );
  constructor(
    private route: Router,
    private ScriptService: ScriptService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.showFooter = new Subject<boolean>();

    this.setRouteIsChangedListener();
    this.setDashBoardStateListener();
  }

  private setRouteIsChangedListener(): void {
    this.route.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter((event: NavigationEnd) => event.url !== '/')
      )
      .pipe(
        delay(500),
        switchMap(() => this.isScriptLoaded$)
      )
      .subscribe((scriptIsLoaded) => {
        if (!scriptIsLoaded) {
          this.ScriptService.loadChatScript();
          this.isScriptLoaded$.next(true);
        }
      });

    this.routeNavigationEnd$
      .pipe(
        map((event: NavigationEnd) =>
          event.url.includes('autentisering/bankid-login') ? true : false
        )
      )
      .subscribe((isSiginicatLogin) => {
        this.isSignicatLogin$.next(isSiginicatLogin);
        console.log('isSignicatLogin');
        console.log(isSiginicatLogin);
      });
  }

  private setDashBoardStateListener(): void {
    this.isUnder992$ = this.breakpointObserver
      .observe('(max-width: 992px)')
      .pipe(map((breakpoint) => breakpoint.matches));

    this.isMobile$ = this.breakpointObserver
      .observe('(max-width: 600px)')
      .pipe(map((breakpoint) => breakpoint.matches));

    this.isUnder992$.subscribe((match) => {
      console.log('match');
      console.log(match);
    });
    combineLatest([
      this.isUnder992$,
      this.isMobile$,
      this.isDashboard,
      this.isSignicatLogin$
    ]).subscribe(([isUnder992, isMobile, isDashboard, isSignicatLogin]) => {
      this.ScriptService.setChatPosition(
        isDashboard,
        isUnder992,
        isMobile,
        isSignicatLogin
      );
    });
  }

  public setFooterState(show: boolean): void {
    this.showFooter.next(show);
  }

  public getFooterState(): Observable<boolean> {
    return this.showFooter;
  }

  public setDashboardState(state: boolean): void {
    this.isDashboard.next(state);
  }

  public getDashboardState(): Subject<boolean> {
    return this.isDashboard;
  }

  public setContentClassName(currentName: string, newName: string): void {
    document.getElementsByClassName(currentName)[0].className = newName;
  }

  public getNotificationOffers(): Observable<number> {
    return this.notificationOffers;
  }

  public getNotificationMortgages(): Observable<number> {
    return this.notificationMortgages;
  }

  public getNotificationHouses(): Observable<number> {
    return this.notificationHouses;
  }

  public addNotificationOffers(): any {
    this.notificationOffers.pipe(scan((acc) => acc + 1, 0));
  }

  public addNotificationMortgages(): any {
    this.notificationMortgages.pipe(scan((acc) => acc + 1, 0));
  }

  public addNotificationHouses(): any {
    this.notificationHouses.pipe(scan((acc) => acc + 1, 0));
  }

  public getNotificationProfile(): Observable<number> {
    return this.notificationProfile.pipe(
      scan((acc, delta) => (delta ? acc + delta : 0), 0)
    );
  }

  public addNotificationProfile(): any {
    this.notificationProfile.next(1);
  }
}
