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
  rootViewContainer: ViewContainerRef;

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
    _animationType: AnimationStylesEnum
  ): void {
    const factory = this.factoryResolver.resolveComponentFactory(
      TopAnimationBannerComponent
    );

    const newNode = document.createElement('div');
    newNode.id = 'placeholder';
    document.getElementsByClassName('content')[0].prepend(newNode);

    this._componentRef = factory.create(this.injector, [], newNode);
    this.isDashboard.getDashboardState().subscribe((state) => {
      this._componentRef.instance.isDashboard = state;
    });
    this._componentRef.instance.animationType = _animationType;
    this._componentRef.instance.changeTimer(_newtime);
    this._componentRef.instance.displayText = _newtext;
    this.appRef.attachView(this._componentRef.hostView);

    setTimeout(() => {
      this.appRef.detachView(this._componentRef.hostView);
    }, _newtime + 2000);
  }
}
