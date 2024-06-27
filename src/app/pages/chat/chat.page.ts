import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Perfil } from 'src/app/enums/perfil';
import { TipoEmpleado } from 'src/app/enums/tipo-empleado';
import { Mensaje } from 'src/app/models/mensaje';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public listaDeMensajes: Array<Mensaje> = new Array<Mensaje>;
  public usuario!: Usuario;
  idUsuarioActual: string;
  public esCliente:boolean = true;
  public esMozo: boolean = false;
  public nombreMozo: string = "";
  public numeroMesaCliente: number = 0;
  public chatForm!: FormGroup;
  ngmensaje!:string ;
  //public mensaje!: Mensaje = new Mensaje();


  constructor(private chatSrv: ChatService, private auth: AuthService, private productoService: ProductoService, private fb:FormBuilder,) {
    this.chatSrv.allMensajes$.subscribe((mensajes) => {

      this.listaDeMensajes = mensajes
      console.log(this.listaDeMensajes);
    });


    this.usuario = this.auth.usuarioActual!;
    this.idUsuarioActual = this.usuario.id;
    if (this.usuario.tipoEmpleado == TipoEmpleado.Mozo) {
      this.esCliente = false;
      this.esMozo = true
      this.nombreMozo = this.usuario.nombre;
    }else{
      this.esCliente = true;
      this.esMozo = false;
      this.numeroMesaCliente = this.usuario.mesaAsignada;
    }
   }

  ngOnInit() {
    this.chatForm = this.fb.group({
      messageCtrl:[''],      
    });  
  }

  enviarMensaje(){
    
    //console.log('El mensaje antes del service ' + this.mensaje);

    const mensaje: Mensaje = {
      id: "",
      mensaje: this.ngmensaje,
      fecha: Date.now(),
      nombreMozo: this.nombreMozo,
      numeroDeMesa: this.numeroMesaCliente,
      idDelEnviador: this.idUsuarioActual

    };

   

    

    this.chatSrv.nuevo(mensaje);

    this.ngmensaje = "";
  }

}
