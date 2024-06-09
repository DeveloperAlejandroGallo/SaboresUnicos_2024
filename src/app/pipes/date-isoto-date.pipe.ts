import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateISOtoDate',
  standalone: true
})
export class DateISOtoDatePipe implements PipeTransform {

  transform(fecha: string): Date {
    return new Date(fecha);
  }

}
