import { Pipe, PipeTransform } from '@angular/core';
import { countries } from 'src/assets/json/countries.data';

@Pipe({
  name: 'country'
})
export class CountryPipe implements PipeTransform {

  countries = countries;

  transform(code: string): string | null {
    const country = this.countries.find((country) => country.code === code);
    if (country) {
      return country.name;
    }
    return null;
  }
}
