import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  ViewContainerRef
} from '@angular/core';

import { DropdownBannerComponent } from '../components/ui-components/dropdown-banner/dropdown-banner.component';

@Injectable()
export class MessageBannerService {
  rootViewContainer: ViewContainerRef;

  private _componentRef: ComponentRef<DropdownBannerComponent>;

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  setView(_newtext: string, _newtime: number): void {
    const factory = this.factoryResolver.resolveComponentFactory(
      DropdownBannerComponent
    );

    const newNode = document.createElement('div');
    newNode.id = 'placeholder';
    document.getElementsByClassName('content')[0].prepend(newNode);

    this._componentRef = factory.create(this.injector, [], newNode);
    this._componentRef.instance.displayText = _newtext;
    this._componentRef.instance.changeTimer(_newtime);
    this.appRef.attachView(this._componentRef.hostView);

    setTimeout(() => {
      this.appRef.detachView(this._componentRef.hostView);
    }, _newtime + 2000);
  }
}
