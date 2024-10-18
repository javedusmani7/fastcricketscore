import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDateFormatPipe implements PipeTransform {
  

  transform(value: string): any {
    // Convert the date string to a Date object
    const dateObject = new Date(value);

    // Options for formatting the date
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    // Format the date using the DatePipe
    return new DatePipe('en-US').transform(dateObject, 'dd MMM, yyyy, EEEE', 'en-US');
  }
}
