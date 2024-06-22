import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordion } from '@ionic/angular';
import { EncuestasService } from 'src/app/services/encuestas.service';

@Component({
  selector: 'app-lista-encuestas',
  templateUrl: './lista-encuestas.component.html',
  styleUrls: ['./lista-encuestas.component.scss'],
})
export class ListaEncuestasComponent  implements OnInit {
  listaEncuestas: any[] = [];
  isLoading = false;
  constructor(private encuestasSvc : EncuestasService) { }

  ngOnInit() {
    
  }
  verEncuestas(event:any){
    const accordionValue = event.detail.value;
    if(accordionValue === 'verEncuestas' ){
      this.isLoading = true;
      if(this.listaEncuestas.length === 0){
        this.encuestasSvc.traerListaEncuestas().subscribe(data=>{
          this.listaEncuestas = data.map(encuesta=>({
            ...encuesta,
            fechaFormateada: this.formatearFecha(encuesta.fecha),
            estrellaFaltante: 5 - encuesta.estrellas
          }));
          this.isLoading = false;
        });
      }
      this.isLoading = false;
    }
  }
  formatearFecha(timestamp: any): string {
    const fecha = new Date(timestamp.seconds * 1000); // Convertir timestamp de Firebase a Date
    return formatDate(fecha, 'HH:mm dd-MM-yyyy', 'en-US');
  }
  getArray(num: number): number[] {
    return Array(num).fill(0);
  }
}
