import { Component, OnInit } from '@angular/core';
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

  constructor(private chatSrv: ChatService, private auth: AuthService, private productoService: ProductoService) {
    this.chatSrv.allMensajes$.subscribe((mensajes) => {

      this.listaDeMensajes = mensajes
      console.log(this.listaDeMensajes);
    });

    this.usuario = this.auth.usuarioActual!;
   }

  ngOnInit() {
  }

}
