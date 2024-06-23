import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Perfil } from 'src/app/enums/perfil';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { Barcode, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { MensajesService } from 'src/app/services/mensajes.service';
import { ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import {
  getAuth,
} from 'firebase/auth';
import { MesasService } from 'src/app/services/mesas.service';
import { Timestamp } from 'firebase/firestore';
import Swal from 'sweetalert2';
const background = '#f8f8f8d7';
@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.page.html',
  styleUrls: ['./home-tabs.page.scss'],
})

export class HomeTabsPage implements OnInit {
  public usuario!: Usuario;
  esCliente:boolean = true;
  url: string;
  codigoLeido : any;
  public isSupported: boolean = false;
  public isPermissionGranted = false;
  listaEspera: any[] = [];
  mesasInfo: any[] = [];
  isLoading = false;
  estaEnEspera : boolean = false;
  constructor(private mesasSvc: MesasService ,private modalController: ModalController, private platform: Platform, private msgService: MensajesService, private router: Router, private auth: AuthService) {
    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);
  }

  ngOnInit() {

    if(this.usuario.perfil == Perfil.Dueño || this.usuario.perfil == Perfil.Empleado){
      this.esCliente = false;
    }
    // this.mesasSvc.traerListaEspera().subscribe(data=>{
    //   this.listaEspera = data;
    //   console.log(this.listaEspera);
      
    // });
    // this.mesasSvc.buscarEnListaXid(this.uidUsuarioActual).subscribe(data=>{
    //   this.estaEnEspera = data.length > 0;
    //   console.log(this.estaEnEspera);
      
    // });
    // this.mesasSvc.traerMesas().subscribe(data=>{
    //   this.mesasInfo = data;
    //   console.log(this.mesasInfo);
      
    // })
    
    if (this.platform.is('capacitor')) {
      try {
        BarcodeScanner.installGoogleBarcodeScannerModule();

        BarcodeScanner.isSupported().then((result: any) => {
          this.isSupported = result.supported;
          if (!this.isSupported) {
            this.msgService.ErrorIonToast(
              'El escaneo de códigos QR no está soportado en este dispositivo'
            );
          }
        });

        BarcodeScanner.checkPermissions().then((result) => {
          this.isPermissionGranted = result.camera === 'granted';
        });
        BarcodeScanner.removeAllListeners();
      } catch (error) {
        console.error('Error al escanear: ' + error);
      }
    }
  }
// GFM1cQ6jVj9P66SiEeNg ID LAURA

  async escanearQR() {

    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        LensFacing: LensFacing.Back
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if(data){
      this.codigoLeido = data?.barcode?.displayValue;
      const datos = this.codigoLeido.split('/');
      console.log(datos);
  
      switch(this.usuario.perfil){
        case Perfil.Cliente:
        case Perfil.Anonimo:
          switch(datos[0]){
            case "IngresoLocal":
              this.ingresarAListaEspera();
              break;
            case "Mesa":
              break;
            case "Propinas":
              break;
          }
          break;
        case Perfil.Dueño:
          break;
        case Perfil.Empleado:
          break;
  
        default:
          this.msgService.Error("No se identifico el tipo de perfil.");
          break;
      }

    }   

  }



  ingresarAListaEspera(){
    if(!this.estaEnEspera){
      Swal.fire({
        title: "¿Quieres entrar a la lista de espera?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0EA06F",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Entrar",
        heightAuto: false,
        background: background
      }).then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          this.mesasSvc.agregarAListaEspera(this.usuario,Timestamp.fromDate(new Date())).then(()=>{
            this.isLoading = false;
            this.msgService.ExitoIonToast("Estas en lista de espera. Pronto se te asignará una mesa. Gracias!", 3);
          }).catch(error=>{
            console.log(error);
          });
        }
      });
    }
    else{
      this.msgService.Info2("Ya estas en la lista de espera.");
    }
  }




}
