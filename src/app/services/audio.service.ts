import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  public inicioSesion!: HTMLAudioElement;
  public logOut!: HTMLAudioElement;
  public error!: HTMLAudioElement;
  public success!: HTMLAudioElement;
  public warning!: HTMLAudioElement;
  public info!: HTMLAudioElement;
  public cambioPagina!: HTMLAudioElement;

  constructor() {
    try {
      this.inicioSesion = new Audio('assets/audios/inicioSesion.wav');
      this.logOut = new Audio('assets/audios/logOut.wav');
      this.error = new Audio('assets/audios/error.wav');
      this.success = new Audio('assets/audios/success.wav');
      this.warning = new Audio('assets/audios/warning.wav');
      this.info = new Audio('assets/audios/info.wav');
      this.cambioPagina = new Audio('assets/audios/load.wav');
    } catch (error) {
      console.error(`Error al cargar los audios: ${error}`);
    }

  }

  reporoduccionInicioSesion(tiempo: number) {
    this.reproducirAuidoPorSegundos(this.inicioSesion, tiempo);
  }

  reporoduccionLogOut(tiempo: number) {
    this.reproducirAuidoPorSegundos(this.logOut, tiempo);
  }

  reporoduccionError(tiempo: number) {
    this.reproducirAuidoPorSegundos(this.error, tiempo);
  }

  reporoduccionSuccess(tiempo: number) {
    this.reproducirAuidoPorSegundos(this.success, tiempo);
  }

  reporoduccionWarning(tiempo: number) {
    this.reproducirAuidoPorSegundos(this.warning, tiempo);
  }

  reporoduccionInfo(tiempo: number) {
    this.reproducirAuidoPorSegundos(this.info, tiempo);
  }

  reporoduccionCambioPagina(tiempo: number) {
    this.reproducirAuidoPorSegundos(this.cambioPagina, tiempo);
  }

  reproducirAuidoPorSegundos(audio: HTMLAudioElement, segundos: number) {
    try {
      audio.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, segundos * 1000);
    } catch (error) {
      console.error(`Error al reporducir el sonido: ${error}`);
    }
  }



}
