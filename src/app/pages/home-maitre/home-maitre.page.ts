import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { Mesa } from 'src/app/models/mesa';
import { MesaService } from 'src/app/services/mesas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ListaEsperaService } from 'src/app/services/lista-espera.service'
import { MensajesService } from 'src/app/services/mensajes.service';
import Swal from 'sweetalert2';
import { EstadoMesa } from 'src/app/enums/estado-mesa';
import { ListaEspera } from 'src/app/models/lista-espera';
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-home-maitre',
  templateUrl: './home-maitre.page.html',
  styleUrls: ['./home-maitre.page.scss'],
})
export class HomeMaitrePage  {

  public usuario!: Usuario;
  url: string;
  public mesasLibres: Array<Mesa> = new Array<Mesa>;
  public listaDeEspera : any[] = [];
  public options: string[] = [];
  public isLoading: boolean = false;
  constructor(
            private router: Router,
            private auth: AuthService,
            private mesaService: MesaService,
            private usrService: UsuarioService,
            private listEsperaService: ListaEsperaService,
            private mensajeService: MensajesService,
            private pushService: PushNotificationService) {

    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);

    this.mesaService.allUsers$.subscribe((mesas) => {

      this.mesasLibres = mesas.filter(x => x.estado == "libre");
      console.log(this.mesasLibres);
    });

    this.listEsperaService.allListaEspera$.subscribe((usuarios) =>{
      this.listaDeEspera = usuarios.filter(x => x.usuario.mesaAsignada == 0);
      console.log(this.listaDeEspera);

    })

    // this.mesaService.traerListaEspera().subscribe((usuarios) =>{
    //   this.listaDeEspera = usuarios;
    // })

  }



   async ofrecerMesas(elementoEspera: ListaEspera) {
    let asignada = 0;

    console.log(this.mesasLibres);


      this.options = this.mesasLibres.map(mesa => 'Mesa ' + mesa.numero)

    if (this.mesasLibres.length == 0) {
      Swal.fire({

        title:'No hay más mesas disponibles',
        icon: "warning",
        confirmButtonText: "OK",
        position: 'center',
        heightAuto: false,
        customClass: {
          popup: 'center-alert'
        }
      }
      )
    } else{
      const { value: mesa } = await Swal.fire({
        title: "Selecciona una mesa",
        input: "select",
        position: 'center',
        heightAuto: false,
        customClass: {
          popup: 'center-alert'
        },
        inputOptions: this.options,
        inputPlaceholder: "Seleccione una mesa",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        cancelButtonColor: '#BF0000',
        confirmButtonColor: '#00ff00',
        inputValidator: (value) => {
          return new Promise((resolve: any) => {
            console.log('Valor value ' + value);

            if (value) {


              resolve();
            }
          });
        }
      });
      if (mesa) {
        let indice = Number(mesa);
        let mesaTexto = this.options[indice]

        console.log('Valor value transformado ' + mesaTexto);

        if (mesaTexto == ("" || undefined || null)) {
          this.mensajeService.Error('La mesa ya fue asignada');
        }
        let numeroDeMesa: number = Number(mesaTexto.split(" ")[1]);
        console.log('Numero de mesa ' +numeroDeMesa);

        const mesasSeleccionadas = this.mesasLibres.filter(x => x.numero === numeroDeMesa);
        console.log('Mesa seleccionada ' + mesasSeleccionadas);

        //console.log(seleccionada);
        let mesaAAsignar: Mesa;
        if (mesasSeleccionadas.length == 0) {
          this.mensajeService.Warning('La mesa ya fue asignada a otro cliente');
          //console.log(objetoSeleccionado);
        }
        mesaAAsignar = mesasSeleccionadas[0];

        this.asignarMesa(elementoEspera,mesaAAsignar);
        this.isLoading = false;
        Swal.fire({
          title:`Seleccionó la mesa número: ` + mesaAAsignar?.numero,
          position: 'center',
          heightAuto: false,
          customClass: {
            popup: 'center-alert'
          }
        }
      );
      }
    }

  }


  asignarMesa(elementoEspera: ListaEspera,mesa: Mesa){
    this.isLoading = true;
    try{
      console.log(mesa.id);
      console.log(elementoEspera.usuario.id);

      // TO DO: MANDAR NOTIFICACIÓN AL CLIENTE DE LA MESA ASIGNADA CON SU QR.
      this.mesaService.cambiarEstadoDeNesa(EstadoMesa.ocupada, mesa.id);

      this.usrService.asignarMesa(mesa.numero, elementoEspera.usuario.id);
      this.listEsperaService.delete(elementoEspera.id);

      this.pushService.notificarMesaAsignada(elementoEspera.usuario, mesa.numero).subscribe((data) => {
        console.log('Respuesta Push: '  + data);
      });
    }catch(ex){

      console.error(ex);
    }









  }


}
