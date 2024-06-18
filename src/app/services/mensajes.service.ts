import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Haptics } from '@capacitor/haptics';
import { ToastController } from '@ionic/angular'; // Importa ToastController

const background = '#f8f8f8d7';

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
      heightAuto: false,
      background: background
    });
  }


  Exito(msg: string) {
    Swal.fire({
      title: 'Éxito',
      text: msg,
      icon: 'success',
      heightAuto: false,
      background: background
    });
  }

  Warning(msg: string) {
    Swal.fire({
      title: 'Advertencia!',
      text: msg,
      icon: 'warning',
      heightAuto: false,
      background: background
    });
  }

  Error(msg: string) {
    Haptics.vibrate({ duration: 750 });
    Swal.fire({
      title: 'Error',
      text: msg,
      icon: 'error',
      heightAuto: false,
      background: background
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
      position: 'top', // Posición del toast
      color: 'danger', // Color que se le aplicará al toast
    });
    Haptics.vibrate({ duration: 750 });
    await toast.present(); // Muestra el toast
  }

  async ExitoIonToast(message: string, t: number): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: t * 1000, // Opcional: Duración del toast
      position: 'top', // Posición del toast
      color: 'success', // Color que se le aplicará al toast
    });

    await toast.present(); // Muestra el toast
  }

  async WarningIonToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Opcional: Duración del toast
      position: 'top', // Posición del toast
      color: 'warning', // Color que se le aplicará al toast
    });
    await toast.present(); // Muestra el toast
  }

  async InfoIonToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Opcional: Duración del toast
      position: 'top', // Posición del toast
      color: 'primary', // Color que se le aplicará al toast
    });
    await toast.present(); // Muestra el toast
  }


}
