import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';
import { RespuestaMail } from '../models/respuesta-mail';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUri = environment.apiPushNotificationAndMail;

  constructor(private http: HttpClient) { }

  enviarEmailAceptacionRechazo(cliente: Usuario, aceptacion: boolean): Observable<any> {
      let nombreUsuario = cliente.nombre;
      let mail = cliente.email;
      return this.http.post<RespuestaMail>(`${this.apiUri}/enviar-email`, { aceptacion, nombreUsuario, mail }).pipe(
        map((response: RespuestaMail) => {

          if (response && response.seEnvio !== undefined) {
            console.log('Se envió el correo:', response.seEnvio);
            console.log('Mensaje:', response.mensaje);
          } else {
            console.log('Error al enviar el correo');
          }
          // Retorna el objeto procesado para mantener la cadena de Observables
          return response;
        })
      );
  }

}
