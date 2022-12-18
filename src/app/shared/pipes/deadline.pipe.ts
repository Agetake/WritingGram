import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deadline'
})
export class DeadlinePipe implements PipeTransform {

  transform(timeInHours: number): string {

    const days = timeInHours/24;

    let noOfDays;
    if (timeInHours < 7) {
      noOfDays = '6 hours';
    }
    if (timeInHours > 6 && timeInHours < 13) {
      noOfDays = '12 hours';
    }
    if (timeInHours > 12 && timeInHours < 25) {
      noOfDays = '1 day';
    }
    if (days > 1 && days < 3) {
      noOfDays = '2 days';
    }
    if (days > 2 && days < 4) {
      noOfDays = '3 days';
    }
    if (days > 3 && days < 6) {
      noOfDays = '5 days';
    }
    if (days > 5 && days < 8) {
      noOfDays = '7 days';
    }
    if (days > 7 && days < 11) {
      noOfDays = '10 days';
    }
    if (days > 10 && days < 15) {
      noOfDays = '14 days';
    }
    if (days > 14 && days < 32) {
      noOfDays = '1 month';
    }
    if (days > 31) {
      noOfDays = '2 months';
    }
    return `${noOfDays}`;
  }
}
