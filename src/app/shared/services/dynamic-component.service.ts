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
export class DynamicComponentService {
  rootViewContainer: ViewContainerRef;

  private _componentRef: ComponentRef<DropdownBannerComponent>;

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    public dropDownComponent: DropdownBannerComponent
  ) {}

  setView(): void {
    const factory = this.factoryResolver.resolveComponentFactory(
      DropdownBannerComponent
    );

    const newNode = document.createElement('div');
    newNode.id = 'placeholder';
    document.getElementsByClassName('content')[0].prepend(newNode);

    this._componentRef = factory.create(this.injector, [], newNode);
    this.appRef.attachView(this._componentRef.hostView);

    // this.dropDownComponent.setTrigger('visible');
    this.dropDownComponent.setTrigger(true);
  }

  removeComponent(): void {
    // this.dropDownComponent.setTrigger('hidden');

    setTimeout(() => {
      this.dropDownComponent.setTrigger(false);
      this.appRef.detachView(this._componentRef.hostView);
    }, 5000);
  }

  // This works, a backup!!!
  //   setComponent(vcr: ViewContainerRef): void {
  //     this.rootViewContainer = vcr;
  //     this.rootViewContainer.insert(this._componentRef.hostView);
  //   }
}
