import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaToString',
  standalone: true
})
export class FechaToStringPipe implements PipeTransform {

  transform(fecha: Date): string {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');

    return `${año}/${mes}/${dia} ${horas}:${minutos}:${segundos}`;
  }

}
