import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'dateDisplay'
})
export class DateDisplayPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(value: string): string {
    const parsedDate = new Date(value);

    if (!isNaN(parsedDate.getTime())) {
      return this.datePipe.transform(parsedDate, 'dd/MM/yyyy HH:mm:ss') || '';
    } else {
      return '';
    }
  }

}
