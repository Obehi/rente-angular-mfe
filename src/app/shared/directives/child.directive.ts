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
      this.renderer.addClass(span, this.childClass);
    }
  }
}
