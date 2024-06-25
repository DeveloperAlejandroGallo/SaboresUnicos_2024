import { Injectable } from '@angular/core';
import { MensajesService } from './mensajes.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  public inicioSesion!: string;
  public logOut!: string;
  public error!: string;
  public success!: string;
  public warning!: string;
  public info!: string;
  public cambioPagina!: string;

  public sonidoActivo: boolean = true;

  constructor(private msgSrv: MensajesService) {
    try {
        this.inicioSesion = 'inicioSesion.wav';
        this.logOut = 'logOut.wav';
        this.error = 'error.wav';
        this.success = 'success.wav';
        this.warning = 'warning.wav';
        this.info = 'info.wav';
        this.cambioPagina = 'cambioPagina.mp3';



    } catch (error) {
      console.error(`Error al cargar los audios: ${error}`);
    }

  }

  reporoduccionInicioSesion() {
    this.reproducirAuido(this.inicioSesion);
  }

  reporoduccionLogOut() {
    this.reproducirAuido(this.logOut);
  }

  reporoduccionError() {
    this.reproducirAuido(this.error);
  }

  reporoduccionSuccess() {
    this.reproducirAuido(this.success);
  }

  reporoduccionWarning() {
    this.reproducirAuido(this.warning);
  }

  reporoduccionInfo() {
    this.reproducirAuido(this.info);
  }

  reporoduccionCambioPagina() {
    this.reproducirAuido(this.cambioPagina);
  }

  async reproducirAuido(audio: string) {
    try {

      if (!this.sonidoActivo)
        return;


      const assetCompleto = `assets/audios/${audio}`;

      // console.log('Cargando audio: ', assetCompleto);

      const audioElement = await this.loadAudio(assetCompleto);

      // Comprueba si el audio ya está reproduciendo
      if (!audioElement.paused) {
        console.log('El audio ya está reproduciendo.');
        return;
      }

      // Intenta reproducir el audio
      audioElement.play().then(() => {
        // console.log('Audio reproduciendo...');
      }).catch((error) => {
        console.error('Error al reproducir el audio:', error);
      });
    } catch (error) {
      console.error(`Error al cargar el audio: ${error}`);
    }
  }

  private async loadAudio(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.addEventListener('canplaythrough', () => resolve(audio));
      audio.onerror = () => reject(new Error(`Error loading audio: ${url}`));
    });
  }
}
