import { Injectable } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  Scroll
} from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import {
  delay,
  filter,
  map,
  scan,
  share,
  switchMap,
  tap
} from 'rxjs/operators';
import { ScriptService } from '@services/script.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DashboardComponent } from '@features/dashboard/dashboard.component';

import { ROUTES_MAP } from '@config/routes-config';
import { TabsService } from './tabs.service';
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
  public activeTab$ = new BehaviorSubject<number>(0);
  public signicatBottomContainerIsDisplayed$ = new BehaviorSubject<boolean>(
    false
  );

  private isUnder992$ = new Observable<boolean>();
  private isMobile$ = new Observable<boolean>();
  private shouldMoveChatUpInSignicat$ = new Observable<boolean>();

  public isScriptLoaded$ = new BehaviorSubject(false);

  private routeNavigationEnd$: Observable<any> = this.route.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    share()
  );
  constructor(
    private route: Router,
    private ScriptService: ScriptService,
    private breakpointObserver: BreakpointObserver,
    private tabsService: TabsService
  ) {
    this.showFooter = new Subject<boolean>();

    this.setRouteIsChangedListener();
    this.setDashBoardStateListener();
  }

  private setRouteIsChangedListener(): void {
    this.route.events
      .pipe(
        filter((event) => event instanceof NavigationStart),

        filter((event: NavigationEnd) => event.url != null),
        map((event) => event.url)
      )
      .subscribe((url) => {
        if (url.includes(ROUTES_MAP.offers)) {
          this.activeTab$.next(0);
        }
        if (url.includes(ROUTES_MAP.loans)) {
          this.activeTab$.next(1);
        }
        if (url.includes(ROUTES_MAP.property)) {
          this.activeTab$.next(2);
        }
        if (url.includes(ROUTES_MAP.profile)) {
          this.activeTab$.next(4);
        }
      });

    this.tabsService.activeLinkIndexAsObservable().subscribe(() => {});

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
      });
  }

  private setDashBoardStateListener(): void {
    this.isUnder992$ = this.breakpointObserver
      .observe('(max-width: 992px)')
      .pipe(map((breakpoint) => breakpoint.matches));

    this.isMobile$ = this.breakpointObserver
      .observe('(max-width: 600px)')
      .pipe(map((breakpoint) => breakpoint.matches));

    this.shouldMoveChatUpInSignicat$ = combineLatest([
      this.isSignicatLogin$,
      this.signicatBottomContainerIsDisplayed$
    ]).pipe(
      map(
        ([isSignicatLogin, signicatBottomContainerIsDisplayed]) =>
          isSignicatLogin && signicatBottomContainerIsDisplayed
      )
    );
    combineLatest([
      this.isUnder992$,
      this.isMobile$,
      this.isDashboard,
      this.shouldMoveChatUpInSignicat$
    ]).subscribe(
      ([isUnder992, isMobile, isDashboard, shouldMoveChatUpInSignicat]) => {
        this.ScriptService.setChatPosition(
          isDashboard,
          isUnder992,
          isMobile,
          shouldMoveChatUpInSignicat
        );
      }
    );
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

  public isSignicatLogin(): Observable<boolean> {
    return this.isSignicatLogin$.asObservable();
  }
}
