import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { TipoProducto } from 'src/app/enums/tipo-producto';
import { Encuesta } from 'src/app/models/encuesta';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EncuestaService } from 'src/app/services/encuesta.service';

@Component({
  selector: 'app-lista-encuestas',
  templateUrl: './lista-encuestas.component.html',
  styleUrls: ['./lista-encuestas.component.scss'],
})
export class ListaEncuestasComponent  implements OnInit {
  listaEncuestas: any[]= [];
  isLoading = true;
  public usuario: Usuario;

  public swiperConfig = {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    navigation: true,
    pagination: { clickable: true }
  };

  constructor(private encuestasSvc : EncuestaService, private auth: AuthService) { 
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);
  }

  ngOnInit() {
    this.encuestasSvc.allEncuestas$.subscribe(data=>{
      this.listaEncuestas = data.map(encuesta=>({
        ...encuesta,
        fechaFormateada: this.formatearFecha(encuesta.fecha),
        estrellaFaltante: 5 - encuesta.cantidadEstrellas
      }));
      this.isLoading = false;
    });
  }
  
  formatearFecha(timestamp: any): string {
    const fecha = new Date(timestamp.seconds * 1000);
    return formatDate(fecha, 'HH:mm dd-MM-yyyy', 'en-US');
  }
  getArray(num: number): number[] {
    return Array(num).fill(0);
  }
}
