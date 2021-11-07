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
      const wrapper = this.el.nativeElement.children[0].children[0];
      const outer = this.el.nativeElement;
      const inner = this.el.nativeElement.children[0];

      const trimmedChildClass = this.childClass.replace(/\s/g, '');
      this.renderer.addClass(wrapper, trimmedChildClass);
      this.renderer.addClass(outer, trimmedChildClass);
      this.renderer.addClass(inner, trimmedChildClass);
    }
  }
}
