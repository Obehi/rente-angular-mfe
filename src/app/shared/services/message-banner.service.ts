import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  OnDestroy
} from '@angular/core';
import {
  AnimationStylesEnum,
  getAnimationStyles
} from '@shared/animations/animationEnums';
import { Subject, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { TopAnimationBannerComponent } from '../components/ui-components/top-animation-banner/top-animation-banner.component';
import { GlobalStateService } from './global-state.service';

@Injectable()
export class MessageBannerService implements OnDestroy {
  private _componentRef: ComponentRef<TopAnimationBannerComponent>;
  public checkAnimationStyle = getAnimationStyles();
  private clickListenerSub: Subscription;
  private scrollListenerSub: Subscription;
  private detachViewSubject = new Subject<void>();
  private detachViewSubscription: Subscription;
  private viewIsAlreadyAttached = false;
  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private globalStateService: GlobalStateService
  ) {}

  ngOnDestroy(): void {
    this.clickListenerSub.unsubscribe();
    this.scrollListenerSub.unsubscribe();
  }
  getContentClass(): string {
    // If its inside dashboard or not, or init connfirmation state. Add here if there are more states
    // return content as default
    if (document.getElementsByClassName('content')[0]) {
      return 'content';
    } else if (document.getElementsByClassName('content-dashboard')[0]) {
      return 'content-dashboard';
    } else if (document.getElementsByClassName('content-blue')[0]) {
      return 'content-blue';
    }
    return 'content';
  }

  setView(
    _newtext: string,
    _newtime: number,
    _animationType: AnimationStylesEnum,
    _status: string,
    _window: Window,
    _isClickable = false,
    _shouldSetTimeout = true,
    _shouldShowArrow = false,
    _callback = () => {}
  ): void {
    const factory = this.factoryResolver.resolveComponentFactory(
      TopAnimationBannerComponent
    );

    if (this.viewIsAlreadyAttached) this.detachView();

    const newNode = document.createElement('div');
    newNode.id = 'placeholder';
    newNode.style.position = 'fixed';
    newNode.style.width = '100%';
    newNode.style.zIndex = '9999';

    if (_window.innerWidth < 992) {
      if (_animationType === this.checkAnimationStyle.SLIDE_UP) {
        newNode.style.bottom = '30px';
      } else {
        newNode.style.top = '70px';
      }
    } else {
      newNode.style.top = '100px';
    }

    document.getElementsByClassName(this.getContentClass())[0].prepend(newNode);

    this._componentRef = factory.create(this.injector, [], newNode);
    if (_shouldShowArrow) {
      this._componentRef.instance.scrollArrow = true;
    }
    this.globalStateService.getDashboardState().subscribe((state) => {
      this._componentRef.instance.isDashboard = state;
      if (state) {
        if (_window.innerWidth < 992) {
          if (_animationType === this.checkAnimationStyle.SLIDE_UP) {
            newNode.style.bottom = '80px';
          } else {
            newNode.style.top = '65px';
          }
        } else {
          if (_animationType === this.checkAnimationStyle.SLIDE_UP) {
            newNode.style.bottom = '30px';
          } else {
            newNode.style.top = '95px';
          }
        }
      }
    });
    this._componentRef.instance.status = _status;
    this._componentRef.instance.animationType = _animationType;
    this._componentRef.instance.changeTimer(_newtime);
    this._componentRef.instance.displayText = _newtext;

    if (_shouldSetTimeout) {
      this.setTimeoutListener(_newtext);
    }

    console.log('ataching view!');
    this.appRef.attachView(this._componentRef.hostView);
    this.viewIsAlreadyAttached = true;

    if (_isClickable) {
      this.clickListenerSub = this._componentRef.instance.clickSubject$.subscribe(
        () => {
          console.log('clickSubject');
          this.detachView();
          _callback();
        }
      );
    }
    /* 
    if (_shouldSetTimeout) {
      console.log('setting detachview timeout');
      this.detachViewWithTimeout(_newtime);
    } */
  }

  public getMessageButtonClickSubject$(): any {
    return this._componentRef.instance.clickSubject$;
  }

  public getClickSubject$(): any {
    return this._componentRef.instance.clickSubject$;
  }

  public detachView(): void {
    this.detachViewSubscription && this.detachViewSubscription.unsubscribe();
    this.viewIsAlreadyAttached = false;
    if (this._componentRef) {
      this.appRef.detachView(this._componentRef.hostView);
      this._componentRef.destroy();
    }
  }

  setSavedViewBolig(
    _newtext: string,
    _newtime: number,
    _animationType: AnimationStylesEnum,
    _status: string,
    _window: Window
  ): void {
    const factory = this.factoryResolver.resolveComponentFactory(
      TopAnimationBannerComponent
    );

    const newNode = document.createElement('div');
    newNode.id = 'placeholder';
    newNode.style.position = 'fixed';
    newNode.style.width = '100%';
    newNode.style.zIndex = '9999';
    if (_window.innerWidth < 992) {
      newNode.style.top = '65px';
    } else {
      newNode.style.top = '95px';
    }

    document.getElementsByClassName('content-dashboard')[0].prepend(newNode);

    this._componentRef = factory.create(this.injector, [], newNode);

    this._componentRef.instance.status = _status;
    this._componentRef.instance.animationType = _animationType;
    this._componentRef.instance.changeTimer(_newtime);
    this._componentRef.instance.displayText = _newtext;

    if (this.viewIsAlreadyAttached) this.detachView();
    this.appRef.attachView(this._componentRef.hostView);

    this.viewIsAlreadyAttached = true;

    this.setTimeoutListener(_newtime);
  }

  setTimeoutListener(timeout): void {
    this.detachViewSubscription = this.detachViewSubject
      .pipe(delay(timeout + 2000))
      .subscribe(() => {
        this.detachView();
      });

    this.detachViewSubject.next();
  }
}
