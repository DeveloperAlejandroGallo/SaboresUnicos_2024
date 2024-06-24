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
  textoHome = "Escanea el QR para ingresar a la lista de espera.";
  constructor(private encuestasSvc : EncuestaService, private auth: AuthService) { 
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);
  }

  ngOnInit() {
    // ------Subiendo encuesta harcodeado
    // const producto: Producto = {
    //   id: '124',
    //   nombre: 'Sandwich de milanesa',
    //   descripcion: 'Sandwich completa',
    //   precio: 10000,
    //   tiempoPreparacionEnMinutos: 30,
    //   fotos: ['https://www.clarin.com/img/2021/09/06/ZUZbnAZNY_720x0__1.jpg'],
    //   tipo: TipoProducto.Comida
    // }
    // const nuevaEncuesta: Encuesta = {
    //   id: '',
    //   cliente: this.usuario,
    //   fecha: Timestamp.fromDate(new Date()),
    //   fotos: ['https://www.clarin.com/img/2021/09/06/ZUZbnAZNY_720x0__1.jpg'],
    //   comentario: 'el mejor sandwich del barrio',
    //   cantidadEstrellas: 5,
    //   SaborDeLaComida: 5,
    //   RecomendariasElLugar: true,
    //   QueCosasAgradaron: [
    //     { cosa: 'comida', si: true },
    //     { cosa: 'bebida', si: true }
    //   ],
    //   MejorComida: producto
    // }
    // this.encuestasSvc.nuevo(nuevaEncuesta);

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
