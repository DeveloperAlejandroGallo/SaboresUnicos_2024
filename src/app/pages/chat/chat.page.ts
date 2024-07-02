import { Component, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewChecked} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { Perfil } from 'src/app/enums/perfil';
import { TipoEmpleado } from 'src/app/enums/tipo-empleado';
import { Mensaje } from 'src/app/models/mensaje';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ProductoService } from 'src/app/services/producto.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit,AfterViewChecked  {


toDate(fecha: number): Date {
  return new Date(fecha);
}
// @ViewChild('content', { static: false }) content: IonContent;
@ViewChild('chat', { static: false }) chatContainer: ElementRef | undefined;

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


  constructor(private chatSrv: ChatService, private auth: AuthService, private productoService: ProductoService, private fb:FormBuilder, private pushService:PushNotificationService) {
    this.chatSrv.allMensajes$.subscribe((mensajes) => {

      this.listaDeMensajes = mensajes
      console.log(this.listaDeMensajes);
    });
    // this.content.scrollToBottom(1500);

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

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  enviarMensaje(){



    const mensaje: Mensaje = {
      id: "",
      mensaje: this.ngmensaje,
      //fecha: new Date(),
      fecha: Date.now(),
      nombreMozo: this.nombreMozo,
      numeroDeMesa: this.numeroMesaCliente,
      idDelEnviador: this.idUsuarioActual

    };

    this.chatSrv.nuevo(mensaje);


    if (this.nombreMozo == "") {
      this.pushService.ConsultaAMozos(this.numeroMesaCliente, this.ngmensaje).subscribe( {
        next: (data) => {
          console.log("Rta Push consulta del cliente: ");
          console.log(data);
        },
        error: (error) => {
          console.error("Error Push consulta del cliente: ");
          console.error(error);
        }
      });
    }
    else{
      
    }
    this.ngmensaje = "";

  }




}
