import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputFormat]'
})
export class InputFormatDirective {
  @Input() format! : string;
  constructor(
    private element : ElementRef
  ) { }

  @HostListener('blur') onBlur(){
    let value : string = this.element.nativeElement.value;
    if (this.format === 'lowercase'){
      this.element.nativeElement.value = value.toLowerCase();
    }
    else if (this.format === 'uppercase'){
      this.element.nativeElement.value = value.toUpperCase();
    }
    else {
      this.element.nativeElement.value = value.toLowerCase();
    }

  }

}
