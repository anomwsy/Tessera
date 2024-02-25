import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCurrencyFormatInput]'
})
export class CurrencyFormatInputDirective implements OnChanges{
  @Input() value: number | null = null;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.value !== null) {
      const formattedValue = this.formatToRupiah(this.value);
      this.el.nativeElement.value = formattedValue;
    }
  }

  private formatToRupiah(value: number): string {
    // Lakukan pemformatan sesuai dengan kebutuhan (contoh sederhana)
    return `Rp ${value.toLocaleString('id-ID')}`;
  }

}
