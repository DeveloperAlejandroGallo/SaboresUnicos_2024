import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { Mesa } from 'src/app/models/mesa';
import { MesaService } from 'src/app/services/mesas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ListaEsperaService } from 'src/app/services/lista-espera.service'
import Swal from 'sweetalert2';
import { map, Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionChanges,
  collectionData,
  CollectionReference,
  collectionSnapshots,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-home-maitre',
  templateUrl: './home-maitre.page.html',
  styleUrls: ['./home-maitre.page.scss'],
})
export class HomeMaitrePage implements OnInit {

  public usuario!: Usuario;
  url: string;
  public mesasLibres: Array<Mesa> = new Array<Mesa>;
  public listaDeEspera : any[] = [];

  constructor(
            private router: Router, 
            private auth: AuthService, 
            private mesaService: MesaService,
            private usrService: UsuarioService,
            private firestore: Firestore,
            private listEsperaService: ListaEsperaService) {

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

  ngOnInit() {

  }

   async ofrecerMesas(cliActual: any) {
    let asignada = 0;

    console.log(this.mesasLibres);

    var options = [];
      options = this.mesasLibres.map(mesa => 'Mesa ' + mesa.numero)

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
        inputOptions: options,
        inputPlaceholder: "Seleccione una mesa",
        showCancelButton: true,
        cancelButtonText:'Cancelar',
        cancelButtonColor: '#BF0000',
        confirmButtonColor: '#00ff00',
        inputValidator: (value) => {
          return new Promise((resolve: any) => {
            if (value) {
              resolve();
            }
          });
        }
      });
      if (mesa) {
        
        const seleccionada = this.mesasLibres.filter((_, index)=> index == mesa);
        //console.log(seleccionada);
        let objetoSeleccionado
        if (seleccionada.length > 0) {
          objetoSeleccionado = seleccionada[0];
          //console.log(objetoSeleccionado); 
        }
        console.log(cliActual);
        
        this.asignarMesa(cliActual,objetoSeleccionado);
        Swal.fire({
          title:`Seleccionó la mesa número: ` + objetoSeleccionado?.numero,
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


  asignarMesa(cliente: any,mesa: Mesa | any){

   
    // TO DO: MANDAR NOTIFICACIÓN AL CLIENTE DE LA MESA ASIGNADA CON SU QR. 
    
    const coleccion = collection(this.firestore, 'mesas');
    const documento = doc(coleccion,mesa.id);
    //console.log(cliente.nombre);
    //console.log(cliente.uid);
    updateDoc(documento,{
      estado: 'ocupada'
    })

    const colleccionClientes = collection(this.firestore, 'usuarios');
    const documentoClientes = doc(colleccionClientes,cliente.usuario.id);
    updateDoc(documentoClientes,{
     mesaAsignada: mesa.numero,
   })

     const coleccionClientesEspera = collection(this.firestore, 'lista_espera');
     const documentoClientesEspera = doc(coleccionClientesEspera,cliente.id);
     deleteDoc(documentoClientesEspera);
     

    

   

  }


}
