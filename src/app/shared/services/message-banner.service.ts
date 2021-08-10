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
import { Subscription } from 'rxjs';

import { TopAnimationBannerComponent } from '../components/ui-components/top-animation-banner/top-animation-banner.component';
import { GlobalStateService } from './global-state.service';

@Injectable()
export class MessageBannerService implements OnDestroy {
  private _componentRef: ComponentRef<TopAnimationBannerComponent>;
  public checkAnimationStyle = getAnimationStyles();
  private clickListenerSub: Subscription;

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private globalStateService: GlobalStateService
  ) {}

  ngOnDestroy(): void {
    this.clickListenerSub.unsubscribe();
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
    shouldSetTimeout = true,
    _callback = () => {}
  ): void {
    const factory = this.factoryResolver.resolveComponentFactory(
      TopAnimationBannerComponent
    );

    const newNode = document.createElement('div');
    newNode.id = 'placeholder';
    newNode.style.position = 'fixed';
    newNode.style.width = '100%';
    newNode.style.zIndex = '99';
    if (_window.innerWidth < 992) {
      if (_animationType === this.checkAnimationStyle.SLIDE_UP) {
        newNode.style.bottom = '90px';
      } else {
        newNode.style.top = '70px';
      }
    } else {
      newNode.style.top = '75px';
    }

    document.getElementsByClassName(this.getContentClass())[0].prepend(newNode);

    this._componentRef = factory.create(this.injector, [], newNode);
    this.globalStateService.getDashboardState().subscribe((state) => {
      this._componentRef.instance.isDashboard = state;
      if (state) {
        if (_window.innerWidth < 992) {
          newNode.style.top = '65px';
        } else {
          newNode.style.top = '95px';
        }
      }
    });
    this._componentRef.instance.status = _status;
    this._componentRef.instance.animationType = _animationType;
    this._componentRef.instance.changeTimer(_newtime);
    this._componentRef.instance.displayText = _newtext;
    this.appRef.attachView(this._componentRef.hostView);

    const clickSubject = this._componentRef.instance.clickSubject$;
    this.clickListenerSub = this._componentRef.instance.clickSubject$.subscribe(
      () => {
        this.detachView();
        _callback();
      }
    );

    shouldSetTimeout && this.detachViewWithTimeout(_newtime);
  }

  private detachViewWithTimeout(newTime: number): void {
    setTimeout(() => {
      this.appRef.detachView(this._componentRef.hostView);
    }, newTime + 2000);
  }

  public detachView(): void {
    this._componentRef && this.appRef.detachView(this._componentRef.hostView);
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
    newNode.style.zIndex = '99';
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
    this.appRef.attachView(this._componentRef.hostView);

    setTimeout(() => {
      this.appRef.detachView(this._componentRef.hostView);
    }, _newtime + 2000);
  }
}
