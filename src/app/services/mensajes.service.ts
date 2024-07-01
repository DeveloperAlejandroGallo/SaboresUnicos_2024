import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Haptics } from '@capacitor/haptics';
import { ToastController } from '@ionic/angular'; // Importa ToastController

const background = 'rgb(255 255 255 / 91%)';

const Toast = Swal.mixin({
  toast: true,
  position: "center",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  background: background,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private toastController: ToastController) { }

  Info(msg: string) {
    Swal.fire({
      title: 'Información',
      text: msg,
      icon: 'info',
      color: "#000000",
      heightAuto: false,
      background: background,
      confirmButtonColor: "#385ba7",
      width: "20em",
      confirmButtonText: "Aceptar",
    });
  }

  Exito(msg: string) {
    Swal.fire({
      title: 'Éxito',
      text: msg,
      icon: 'success',
      heightAuto: false,
      background: background,
      confirmButtonText: "Aceptar",
    });
  }

  Warning(msg: string) {
    Swal.fire({
      title: 'Advertencia!',
      text: msg,
      icon: 'warning',
      heightAuto: false,
      background: background,
      confirmButtonText: "Aceptar",
    });
  }

  Error(msg: string) {
    Haptics.vibrate({ duration: 750 });
    Swal.fire({
      title: 'Error',
      text: msg,
      icon: 'error',
      color: "#F27474",
      heightAuto: false,
      background: background,
      confirmButtonColor: "#385ba7",
      confirmButtonText: "Aceptar",
      width: "20em",
    });
  }

  InfoToast(msg: string) {
    Toast.fire({
      title: 'Información',
      text: msg,
      icon: 'info'
    });
  }


  ExitoToast(msg: string) {
    Toast.fire({
      title: 'Éxito',
      text: msg,
      icon: 'success'
    });
  }

  WarningToast(msg: string) {
    Toast.fire({
      title: 'Advertencia!',
      text: msg,
      icon: 'warning'
    });
  }

  ErrorToast(msg: string) {
    Haptics.vibrate({ duration: 750 });
    Toast.fire({
      title: 'Error',
      text: msg,
      icon: 'error'
    });
  }




  async ErrorIonToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Opcional: Duración del toast
      position: 'bottom', // Posición del toast
      color: 'danger', // Color que se le aplicará al toast
    });
    Haptics.vibrate({ duration: 750 });
    await toast.present(); // Muestra el toast
  }

  async ExitoIonToast(message: string, t: number): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: t * 1000, // Opcional: Duración del toast
      position: 'middle', // Posición del toast
      color: 'success', // Color que se le aplicará al toast
    });

    await toast.present(); // Muestra el toast
  }

  async WarningIonToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Opcional: Duración del toast
      position: 'bottom', // Posición del toast
      color: 'warning', // Color que se le aplicará al toast
    });
    await toast.present(); // Muestra el toast
  }

  async InfoIonToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Opcional: Duración del toast
      position: 'bottom', // Posición del toast
      color: 'primary', // Color que se le aplicará al toast
    });
    await toast.present(); // Muestra el toast
  }


}
