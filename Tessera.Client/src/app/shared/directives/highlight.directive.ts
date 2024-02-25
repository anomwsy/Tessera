import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  constructor(private element: ElementRef) {}
  randColor() {
    // Generate random values for Red, Green, and Blue components
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    // Convert the decimal values to hexadecimal and concatenate
    var hexColor =
      '#' +
      red.toString(16).padStart(2, '0') +
      green.toString(16).padStart(2, '0') +
      blue.toString(16).padStart(2, '0');

    return hexColor;
  }
  @HostListener('mouseenter') sadasdsfaagsdfasdfsa() {
    this.element.nativeElement.style.backgroundColor = this.randColor();
    this.element.nativeElement.style.fontWeight = 'bold';
    this.element.nativeElement.style.cursor = 'pointer';
  }

  // @HostListener('mouseleave') onMouseLeave() {
  //   this.element.nativeElement.style.color = 'black';
  //   this.element.nativeElement.style.fontWeight = 'normal';
  // }
}
