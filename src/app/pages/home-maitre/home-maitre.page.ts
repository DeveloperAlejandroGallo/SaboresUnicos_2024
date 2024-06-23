import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { Mesa } from 'src/app/models/mesa';
import { MesasService } from 'src/app/services/mesas.service';

import { MesaService } from 'src/app/services/mesa.service';
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
            private mesasService: MesasService, 
            private firestore: Firestore) {

    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);

    this.mesaService.allMesas$.subscribe((mesas) => {

      this.mesasLibres = mesas.filter(x => x.estado == "Libre");
      console.log(this.mesasLibres);
    });

    this.mesasService.traerListaEspera().subscribe((usuarios) =>{
      this.listaDeEspera = usuarios;
    })
    
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
    // } else {
    //   Swal.fire({
    //     title: 'La mesa ' + this.mesasLibres[0].numero + ' se encuentra disponible',
    //     //text: 'Tipo de mesa: '+this.mesasLibres[0].tipo + ' hasta '+ this.mesasLibres[0].comensales + ' comensales',
    //     showDenyButton: true,
    //     confirmButtonText: `Asignar`,
    //     denyButtonText: `No gracias`,
    //     position: 'center',
    //     heightAuto: false,
    //     customClass: {
    //       popup: 'center-alert'
    //     }
    //   }).then((result0) => {
    //     if (result0.isConfirmed) {
    //       this.asignarMesa(cliActual,this.mesasLibres[0]);
    //       Swal.fire({
  
    //         title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
    //         icon: "success",
    //         confirmButtonText: "OK",
    //         position: 'center',
    //         heightAuto: false,
    //         customClass: {
    //           popup: 'center-alert'
    //         }
    //       }
    //       )
    //       asignada = 1;
    //     } else if (result0.isDenied) {
    //       if (this.mesasLibres[1]) {
    //       Swal.fire({
    //         title: 'La mesa ' + this.mesasLibres[1].numero + ' se encuentra disponible',
    //         //text: 'Tipo de mesa: '+this.listadoMesasLibres[1].tipo + ' hasta '+ this.listadoMesasLibres[1].comensales + ' comensales',
    //         showDenyButton: true,
    //         confirmButtonText: `Asignar`,
    //         denyButtonText: `No gracias`,
    //         position: 'center',
    //         heightAuto: false,
    //         customClass: {
    //           popup: 'center-alert'
    //         }
    //       }).then((result1) => {
    //         if (result1.isConfirmed) {
    //           this.asignarMesa(cliActual,this.mesasLibres[1]);
    //           Swal.fire({
  
    //             title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
    //             icon: "success",
    //             confirmButtonText: "OK",
    //             position: 'center',
    //             heightAuto: false,
    //             customClass: {
    //               popup: 'center-alert'
    //             }
    //           }
    //           )
    //           asignada = 1;
    //         } else if (result1.isDenied) {
  
    //           if (this.mesasLibres[2]) {
    //             Swal.fire({
    //               title: 'La mesa ' + this.mesasLibres[2].numero + ' se encuentra disponible',
    //               //text: 'Tipo de mesa: '+this.listadoMesasLibres[2].tipo + ' hasta '+ this.listadoMesasLibres[2].comensales + ' comensales',
    //               showDenyButton: true,
    //               confirmButtonText: `Asignar`,
    //               denyButtonText: `No gracias`,
    //               position: 'center',
    //               heightAuto: false,
    //               customClass: {
    //                 popup: 'center-alert'
    //               }
    //             }).then((result2) => {
    //               if (result2.isConfirmed) {
    //                 this.asignarMesa(cliActual,this.mesasLibres[2]);
    //                 Swal.fire({
  
    //                   title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
    //                   icon: "success",
    //                   confirmButtonText: "OK",
    //                   position: 'center',
    //                   heightAuto: false,
    //                   customClass: {
    //                     popup: 'center-alert'
    //                   }
    //                 }
    //                 )
    //                 asignada = 2;
    //               } else if (result2.isDenied) {
    //                 if (this.mesasLibres[3]) {
    //                   Swal.fire({
    //                     title: 'La mesa ' + this.mesasLibres[3].numero + ' se encuentra disponible',
    //                     //text: 'Tipo de mesa: '+this.listadoMesasLibres[3].tipo + ' hasta '+ this.listadoMesasLibres[3].comensales + ' comensales',
    //                     showDenyButton: true,
    //                     confirmButtonText: `Asignar`,
    //                     denyButtonText: `No gracias`,
    //                     position: 'center',
    //                     heightAuto: false,
    //                     customClass: {
    //                       popup: 'center-alert'
    //                     }
    //                   }).then((result3) => {
    //                     if (result3.isConfirmed) {
    //                       this.asignarMesa(cliActual,this.mesasLibres[3]);
    //                       Swal.fire({
  
    //                         title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
    //                         icon: "success",
    //                         confirmButtonText: "OK",
    //                         position: 'center',
    //                         heightAuto: false,
    //                         customClass: {
    //                           popup: 'center-alert'
    //                         }
    //                       }
    //                       )
    //                       asignada = 3;
    //                     } else if (result3.isDenied) {
    //                       if (this.mesasLibres[4]) {
    //                         Swal.fire({
    //                           title: 'La mesa ' + this.mesasLibres[4].numero + ' se encuentra disponible',
    //                           //text: 'Tipo de mesa: '+this.listadoMesasLibres[4].tipo + ' hasta '+ this.listadoMesasLibres[4].comensales + ' comensales',
    //                           showDenyButton: true,
    //                           confirmButtonText: `Asignar`,
    //                           denyButtonText: `No gracias`,
    //                           position: 'center',
    //                           heightAuto: false,
    //                           customClass: {
    //                             popup: 'center-alert'
    //                           }
    //                         }).then((result4) => {
    //                           if (result4.isConfirmed) {
    //                             this.asignarMesa(cliActual,this.mesasLibres[4]);
    //                             Swal.fire({
  
    //                               title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
    //                               icon: "success",
    //                               confirmButtonText: "OK",
    //                               position: 'center',
    //                               heightAuto: false,
    //                               customClass: {
    //                                 popup: 'center-alert'
    //                               }
    //                             }
    //                             )
    //                             asignada = 4;
    //                           } else if (result4.isDenied) {
    //                             if (this.mesasLibres[5]) {
    //                               Swal.fire({
    //                                 title: 'La mesa ' + this.mesasLibres[5].numero + ' se encuentra disponible',
    //                                 //text: 'Tipo de mesa: '+this.listadoMesasLibres[5].tipo + ' hasta '+ this.listadoMesasLibres[5].comensales + ' comensales',
    //                                 showDenyButton: true,
    //                                 confirmButtonText: `Asignar`,
    //                                 denyButtonText: `No gracias`,
    //                                 position: 'center',
    //                                 heightAuto: false,
    //                                 customClass: {
    //                                   popup: 'center-alert'
    //                                 }
    //                               }).then((result5) => {
    //                                 if (result5.isConfirmed) {
    //                                   this.asignarMesa(cliActual,this.mesasLibres[5]);
    //                                   Swal.fire({
  
    //                                     title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
    //                                     icon: "success",
    //                                     confirmButtonText: "OK",
    //                                     position: 'center',
    //                                     heightAuto: false,
    //                                     customClass: {
    //                                       popup: 'center-alert'
    //                                     }
    //                                   }
    //                                   )
    //                                   asignada = 5;
    //                                 } else if (result5.isDenied) {
  
    //                                 }
    //                               })
    //                             }
    //                           }
    //                         })
    //                       }
    //                     }
    //                   })
    //                 }
    //               }
    //             })
  
  
    //           }
    //         }
        
    //       });
    //       }
          
    //     }
    //   });
    // }

    
    



  }


  asignarMesa(cliente: any,mesa: Mesa | any){

   
    // TO DO: MANDAR NOTIFICACIÓN AL CLIENTE DE LA MESA ASIGNADA CON SU QR. 
    
    const coleccion = collection(this.firestore, 'mesas');
    const documento = doc(coleccion,mesa.id);
    //console.log(cliente.nombre);
    //console.log(cliente.uid);
    updateDoc(documento,{
      nombre_cliente: cliente.nombre,
      cliente_uid: cliente.uid,
      estado: 'Ocupada'
    })

     const coleccionClientesEspera = collection(this.firestore, 'lista_espera');
     const documentoClientesEspera = doc(coleccionClientesEspera,cliente.uid);
     deleteDoc(documentoClientesEspera);
     

     const colleccionClientes = collection(this.firestore, 'usuarios');
     const documentoClientes = doc(colleccionClientes,cliente.uid);
     updateDoc(documentoClientes,{
      mesaAsignada: mesa.numero,
    })

   

  }


}
