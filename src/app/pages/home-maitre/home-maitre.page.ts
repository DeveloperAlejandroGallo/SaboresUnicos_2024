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
import { PedidoService } from 'src/app/services/pedido.service';

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
            private pushService: PushNotificationService,
            private pedidoSrv: PedidoService) {

    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);

    this.mesaService.allUsers$.subscribe((mesas) => {

      this.mesasLibres = mesas.filter(x => x.estado == "libre");

    });

    this.listEsperaService.allListaEspera$.subscribe((usuarios) =>{
      this.listaDeEspera = usuarios.filter(x => x.usuario.mesaAsignada == 0);

    })


  }



   async ofrecerMesas(elementoEspera: ListaEspera) {

    this.options = this.mesasLibres.map(mesa => 'Mesa ' + mesa.numero)

    if (this.mesasLibres.length == 0) {
      Swal.fire({

        title:'No hay más mesas disponibles',
        icon: "warning",
        confirmButtonText: "Cerrar",
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
        confirmButtonColor: "#0EA06F",
        confirmButtonText: "Aceptar",
        cancelButtonColor: "#d33",
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

        this.isLoading = true;

        if (mesaTexto == ("" || undefined || null)) {
          this.mensajeService.Error('La mesa ya fue asignada');
          this.isLoading = false;
          return;
        }
        let numeroDeMesa: number = Number(mesaTexto.split(" ")[1]);

        const mesasSeleccionadas = this.mesasLibres.filter(x => x.numero === numeroDeMesa);

        //console.log(seleccionada);
        let mesaAAsignar: Mesa;
        if (mesasSeleccionadas.length == 0) {
          this.mensajeService.Warning('La mesa ya fue asignada a otro cliente');
          this.isLoading = false;
          return;
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
          },
          confirmButtonText: "Aceptar",
        }
      );
      }
    }

  }


  asignarMesa(elementoEspera: ListaEspera,mesa: Mesa){

    try{


      this.usrService.escucharUsuario(elementoEspera.usuario.id).subscribe( {
        next: (data) => {
          elementoEspera.usuario = data;
        }
      });




      this.usrService.asignarMesa(mesa.numero, elementoEspera.usuario.id);

      //Al asignar mesa creo el pedido con la relacion entre todos:
      console.log("Creando Pedido para Mesa y Usuario.");
      console.log(mesa);
      console.log(elementoEspera.usuario);
      let nuevoPedido = this.pedidoSrv.nuevo(elementoEspera.usuario, mesa);


      this.mesaService.cambiarEstadoDeMesa(EstadoMesa.ocupada, mesa.id, nuevoPedido.id);

      this.listEsperaService.delete(elementoEspera.id);

      this.pushService.MesaAsignada(elementoEspera.usuario, mesa.numero).subscribe( {
        next: (data) => {
          console.log("Rta Push Mesa Asignada: ");
          console.log(data);
        },
        error: (error) => {
          console.error("Error Push Mesa Asignada: ");
          console.error(error);
          this.isLoading = false;
        }
      });
    }catch(ex){

      console.error(ex);
      this.isLoading = false;
    }









  }


}
