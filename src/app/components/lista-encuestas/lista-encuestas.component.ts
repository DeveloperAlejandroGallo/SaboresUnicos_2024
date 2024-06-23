import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Encuesta } from 'src/app/models/encuesta';
import { EncuestaService } from 'src/app/services/encuesta.service';

@Component({
  selector: 'app-lista-encuestas',
  templateUrl: './lista-encuestas.component.html',
  styleUrls: ['./lista-encuestas.component.scss'],
})
export class ListaEncuestasComponent  implements OnInit {
  listaEncuestas: any[]= [];
  isLoading = false;
  textoHome = "Escanea el QR para ingresar a la lista de espera.";
  constructor(private encuestasSvc : EncuestaService) { }

  ngOnInit() {
    
  }
  verEncuestas(event:any){
    const accordionValue = event.detail.value;
    if(accordionValue === 'verEncuestas' ){
      this.isLoading = true;
      if(this.listaEncuestas.length === 0){
        this.encuestasSvc.allEncuestas$.subscribe(data=>{
          this.listaEncuestas = data.map(encuesta=>({
            ...encuesta,
            fechaFormateada: this.formatearFecha(encuesta.fecha),
            estrellaFaltante: 5 - encuesta.cantidadEstrellas
          }));
          this.isLoading = false;
        });
      }
      this.isLoading = false;
    }
  }
  formatearFecha(timestamp: any): string {
    const fecha = new Date(timestamp.seconds * 1000);
    return formatDate(fecha, 'HH:mm dd-MM-yyyy', 'en-US');
  }
  getArray(num: number): number[] {
    return Array(num).fill(0);
  }
}
