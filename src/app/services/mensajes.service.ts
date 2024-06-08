import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Haptics } from '@capacitor/haptics';

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() { }

  Info(msg: string) {
    Swal.fire({
      title: 'Información',
      text: msg,
      icon: 'info',
      heightAuto: false,
    });
  }


  Exito(msg: string) {
    Swal.fire({
      title: 'Éxito',
      text: msg,
      icon: 'success',
      heightAuto: false,
    });
  }

  Warning(msg: string) {
    Swal.fire({
      title: 'Advertencia!',
      text: msg,
      icon: 'warning',
      heightAuto: false,
    });
  }

  Error(msg: string) {
    Haptics.vibrate({ duration: 1000 });
    Swal.fire({
      title: 'Error',
      text: msg,
      icon: 'error',
      heightAuto: false
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
    Swal.fire({
      title: 'Advertencia!',
      text: msg,
      icon: 'warning'
    });
  }

  ErrorToast(msg: string) {
    Haptics.vibrate({ duration: 1000 });
    Swal.fire({
      title: 'Error',
      text: msg,
      icon: 'error'
    });
  }

}
