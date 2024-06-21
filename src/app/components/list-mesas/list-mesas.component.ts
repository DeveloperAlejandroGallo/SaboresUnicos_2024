import { Component, OnInit } from '@angular/core';
import { Mesa } from 'src/app/models/mesa';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { MesaService } from 'src/app/services/mesa.service';

@Component({
  selector: 'app-list-mesas',
  templateUrl: './list-mesas.component.html',
  styleUrls: ['./list-mesas.component.scss'],
})
export class ListMesasComponent  {

  //public mesa: Mesa;
  public usuario: Usuario;
  public mesas: Array<Mesa> = new Array<Mesa>;

  constructor(private auth: AuthService,
    private mesaService: MesaService,
    private msgService: MensajesService) {

    this.usuario = this.auth.usuarioActual!;

    this.mesaService.allMesas$.subscribe((mesas) => {

      this.mesas = mesas.filter(x => x.estado == "Libre");
      console.log(this.mesas);
    });

  }

  asignar(){
    try{
     
      
      }
      catch(ex){
        console.error(`Error al asignar mesa: ${ex}`)
        this.msgService.Error("Error al asignar mesa.");
      }
  }

 

}
