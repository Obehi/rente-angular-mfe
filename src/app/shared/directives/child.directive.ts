import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[child]'
})
export class ChildDirective {
  @Input('childClass')
  childClass: string;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (this.childClass !== '') {
      const span = this.el.nativeElement.querySelector('span');
      const trimmedChildClass = this.childClass.replace(/\s/g, '');
      this.renderer.addClass(span, trimmedChildClass);
    }
  }
}
