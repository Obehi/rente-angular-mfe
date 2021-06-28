import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  ViewContainerRef
} from '@angular/core';
import { AnimationStylesEnum } from '@shared/animations/animationEnums';

import { TopAnimationBannerComponent } from '../components/ui-components/top-animation-banner/top-animation-banner.component';
import { GlobalStateService } from './global-state.service';

@Injectable()
export class MessageBannerService {
  private _componentRef: ComponentRef<TopAnimationBannerComponent>;

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private isDashboard: GlobalStateService
  ) {}

  setView(
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
    newNode.style.zIndex = '2';
    if (_window.innerWidth < 992) {
      newNode.style.top = '70px';
    } else {
      newNode.style.top = '75px';
    }
    document.getElementsByClassName('content')[0].prepend(newNode);

    this._componentRef = factory.create(this.injector, [], newNode);
    this.isDashboard.getDashboardState().subscribe((state) => {
      console.log('Get dashboard state in message banner service');
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

    setTimeout(() => {
      this.appRef.detachView(this._componentRef.hostView);
    }, _newtime + 2000);
  }
}
