import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { Mesa } from 'src/app/models/mesa';
import { MesaService } from 'src/app/services/mesa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-maitre',
  templateUrl: './home-maitre.page.html',
  styleUrls: ['./home-maitre.page.scss'],
})
export class HomeMaitrePage implements OnInit {

  listadoEnEspera = [
    "Juan",
    "María",
    "Carlos",
    "Ana",
    "Pedro",
    "Laura",
    "José",
    "Carmen",
    "Luis",
    "Elena",
    "Miguel",
    "Marta",
    "Francisco",
    "Sofía",
    "Antonio",
    "Paula",
    "David",
    "Lucía",
    "Manuel",
    "Isabel"
  ];

  public usuario!: Usuario;
  url: string;
  public mesasLibres: Array<Mesa> = new Array<Mesa>;

  constructor(private router: Router, private auth: AuthService, private mesaService: MesaService) {
    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);

    this.mesaService.allMesas$.subscribe((mesas) => {

      this.mesasLibres = mesas.filter(x => x.estado == "Libre");
      console.log(this.mesasLibres);
    });
  }

  ngOnInit() {

  }

  ofrecerMesas(cliActual: any) {
    let asignada = 0;

    console.log(this.mesasLibres);

    Swal.fire({
      title: 'La mesa ' + this.mesasLibres[0].numero + ' se encuentra disponible',
      //text: 'Tipo de mesa: '+this.mesasLibres[0].tipo + ' hasta '+ this.mesasLibres[0].comensales + ' comensales',
      showDenyButton: true,
      confirmButtonText: `Asignar`,
      denyButtonText: `No gracias`,
      position: 'center',
      heightAuto: false,
      customClass: {
        popup: 'center-alert'
      }
    }).then((result0) => {
      if (result0.isConfirmed) {
        this.asignarMesa(cliActual,this.mesasLibres[0]);
        Swal.fire({

          title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
          icon: "success",
          confirmButtonText: "OK",
          position: 'center',
          heightAuto: false,
          customClass: {
            popup: 'center-alert'
          }
        }
        )
        asignada = 1;
      } else if (result0.isDenied) {
        if (this.mesasLibres[1]) {
        Swal.fire({
          title: 'La mesa ' + this.mesasLibres[1].numero + ' se encuentra disponible',
          //text: 'Tipo de mesa: '+this.listadoMesasLibres[1].tipo + ' hasta '+ this.listadoMesasLibres[1].comensales + ' comensales',
          showDenyButton: true,
          confirmButtonText: `Asignar`,
          denyButtonText: `No gracias`,
          position: 'center',
          heightAuto: false,
          customClass: {
            popup: 'center-alert'
          }
        }).then((result1) => {
          if (result1.isConfirmed) {
            this.asignarMesa(cliActual,this.mesasLibres[1]);
            Swal.fire({

              title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
              icon: "success",
              confirmButtonText: "OK",
              position: 'center',
              heightAuto: false,
              customClass: {
                popup: 'center-alert'
              }
            }
            )
            asignada = 1;
          } else if (result1.isDenied) {

            if (this.mesasLibres[2]) {
              Swal.fire({
                title: 'La mesa ' + this.mesasLibres[2].numero + ' se encuentra disponible',
                //text: 'Tipo de mesa: '+this.listadoMesasLibres[2].tipo + ' hasta '+ this.listadoMesasLibres[2].comensales + ' comensales',
                showDenyButton: true,
                confirmButtonText: `Asignar`,
                denyButtonText: `No gracias`,
                position: 'center',
                heightAuto: false,
                customClass: {
                  popup: 'center-alert'
                }
              }).then((result2) => {
                if (result2.isConfirmed) {
                  this.asignarMesa(cliActual,this.mesasLibres[2]);
                  Swal.fire({

                    title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
                    icon: "success",
                    confirmButtonText: "OK",
                    position: 'center',
                    heightAuto: false,
                    customClass: {
                      popup: 'center-alert'
                    }
                  }
                  )
                  asignada = 2;
                } else if (result2.isDenied) {
                  if (this.mesasLibres[3]) {
                    Swal.fire({
                      title: 'La mesa ' + this.mesasLibres[3].numero + ' se encuentra disponible',
                      //text: 'Tipo de mesa: '+this.listadoMesasLibres[3].tipo + ' hasta '+ this.listadoMesasLibres[3].comensales + ' comensales',
                      showDenyButton: true,
                      confirmButtonText: `Asignar`,
                      denyButtonText: `No gracias`,
                      position: 'center',
                      heightAuto: false,
                      customClass: {
                        popup: 'center-alert'
                      }
                    }).then((result3) => {
                      if (result3.isConfirmed) {
                        this.asignarMesa(cliActual,this.mesasLibres[3]);
                        Swal.fire({

                          title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
                          icon: "success",
                          confirmButtonText: "OK",
                          position: 'center',
                          heightAuto: false,
                          customClass: {
                            popup: 'center-alert'
                          }
                        }
                        )
                        asignada = 3;
                      } else if (result3.isDenied) {
                        if (this.mesasLibres[4]) {
                          Swal.fire({
                            title: 'La mesa ' + this.mesasLibres[4].numero + ' se encuentra disponible',
                            //text: 'Tipo de mesa: '+this.listadoMesasLibres[4].tipo + ' hasta '+ this.listadoMesasLibres[4].comensales + ' comensales',
                            showDenyButton: true,
                            confirmButtonText: `Asignar`,
                            denyButtonText: `No gracias`,
                            position: 'center',
                            heightAuto: false,
                            customClass: {
                              popup: 'center-alert'
                            }
                          }).then((result4) => {
                            if (result4.isConfirmed) {
                              this.asignarMesa(cliActual,this.mesasLibres[4]);
                              Swal.fire({

                                title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
                                icon: "success",
                                confirmButtonText: "OK",
                                position: 'center',
                                heightAuto: false,
                                customClass: {
                                  popup: 'center-alert'
                                }
                              }
                              )
                              asignada = 4;
                            } else if (result4.isDenied) {
                              if (this.mesasLibres[5]) {
                                Swal.fire({
                                  title: 'La mesa ' + this.mesasLibres[5].numero + ' se encuentra disponible',
                                  //text: 'Tipo de mesa: '+this.listadoMesasLibres[5].tipo + ' hasta '+ this.listadoMesasLibres[5].comensales + ' comensales',
                                  showDenyButton: true,
                                  confirmButtonText: `Asignar`,
                                  denyButtonText: `No gracias`,
                                  position: 'center',
                                  heightAuto: false,
                                  customClass: {
                                    popup: 'center-alert'
                                  }
                                }).then((result5) => {
                                  if (result5.isConfirmed) {
                                    this.asignarMesa(cliActual,this.mesasLibres[5]);
                                    Swal.fire({

                                      title:'Mesa ' + this.mesasLibres[0].numero + ' asignada!',
                                      icon: "success",
                                      confirmButtonText: "OK",
                                      position: 'center',
                                      heightAuto: false,
                                      customClass: {
                                        popup: 'center-alert'
                                      }
                                    }
                                    )
                                    asignada = 5;
                                  } else if (result5.isDenied) {

                                  }
                                })
                              }
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })


            }
          }
      
        });
        }
        
      }
    });
    



  }


  asignarMesa(cliente: any,mesa: any){

    // cliente.enMesa = mesa.numero;
    // this.firestore.updateBD(cliente.id,cliente.toJson(),'usuarios').then(() =>{
    //   mesa.cliente = cliente.toJson();
    //   mesa.estado = 'ocupada';
    //   this.firestore.updateBD(mesa.id,mesa.toJson(),'mesas').then(()=>{
    //     this.quitarEnEspera(cliente);
    //     console.log("Los dos asignados");


    //   });
    // });

  }

  // quitarEnEspera(cliente){
  //   this.firestore.deleteRegFrom(cliente.id,'listaDeEspera');
  // }

}
