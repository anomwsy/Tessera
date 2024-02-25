import { CurrencyFormatInputDirective } from './currency-format-input.directive';

describe('CurrencyFormatInputDirective', () => {
  it('should create an instance', (args : any) => {
    const directive = new CurrencyFormatInputDirective(args);
    expect(directive).toBeTruthy();
  });
});
