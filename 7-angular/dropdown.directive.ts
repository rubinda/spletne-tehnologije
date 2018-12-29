import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  isOpen = false;

  @HostListener('click') toggleOpen() {
    // this.isOpen = !this.isOpen;
    this.isOpen = !this.isOpen;
    if (this.isOpen)
      this.renderer.addClass(this.el.nativeElement.querySelector(".dropdown-menu"), "show");
    else
      this.renderer.removeClass(this.el.nativeElement.querySelector(".dropdown-menu"), "show");
  }

  constructor(private renderer: Renderer2, private el: ElementRef) { }


}
