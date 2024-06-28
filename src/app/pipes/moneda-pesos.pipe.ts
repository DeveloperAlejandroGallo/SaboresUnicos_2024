import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monedaPesos',
  standalone: true
})
export class MonedaPesosPipe implements PipeTransform {

  transform(importe: number): string {
    const formateador = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formateador.format(importe);
  }

}
