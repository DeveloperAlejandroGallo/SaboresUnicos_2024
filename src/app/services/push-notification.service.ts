import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoEmpleado } from '../enums/tipo-empleado';
import { Usuario } from '../models/usuario';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private apiUri = environment.apiPushNotificationAndMail;

  constructor(private http: HttpClient) { }


  notificarAltaCliente(usuario: Usuario, role: TipoEmpleado): Observable<any> {
    let title = 'Nuevo Cliente Registrado';
    let body = `Se ha registrado el Cliente ${usuario.nombre} ${usuario.apellido} con el email: ${usuario.email}.`;
    return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }

  notificarMesaAsignada(usuario: Usuario, mesaNro: number): Observable<any> {
    console.log("Enviando a Token:"+usuario.token);
    let token = usuario.token;
    let title = 'Mesa Asignada';
    let body = `Por favor acerquese a la Mesa Nro: ${mesaNro}. Y escanee su código para comenzar a disfrutar de nuestros servicios.`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }

  notificarChatMozos(mesaNumero: number): Observable<any> {
    let title = `Nuevo mensaje de Mesa ${mesaNumero}`;
    let body = `Nuevo pedido de comida de Mesa ${mesaNumero}. Por favor revisar la lista de pedidos.`;
    let role = TipoEmpleado.Mozo;
    return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }

  notificarCocinerosNuevoPedido(mesaNumero: number): Observable<any> {
    let title: string = 'Nuevo pedido de Comida';
    let body = `Nuevo pedido de comida de Mesa ${mesaNumero}. Por favor revisar la lista de pedidos.`;
    let role = TipoEmpleado.Cocinero;
    return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }

  notificarBartendersNuevoPedido(mesaNumero: number): Observable<any> {
    let title = 'Nuevo pedido de Bebida';
    let body = `Nuevo pedido de bebidas de Mesa ${mesaNumero}. Por favor revisar la lista de pedidos.`;
    let role = TipoEmpleado.Bartender;
      return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }


  notificarMozoPedidoListo(MozoDelPedido: Usuario, mesaNro: number): Observable<any> {
    let token = MozoDelPedido.token;
    let title = `Pedido Mesa ${mesaNro} Listo`;
    let body = `El pedido de la Mesa Nro: ${mesaNro} se encuestra listo para entregar.`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }

  notificarMozoPedidoCuenta(pedido: Pedido): Observable<any> {
    let token = pedido.mozo!.token;
    let title = `Cierre de Cuenta Mesa ${pedido.mesa.numero}.`;

    let body = `${pedido.cliente.nombre} de la Mesa Nro: ${pedido.mesa.numero} desea cerrar la cuenta por un total de $ ${pedido.total}.`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }

  notificarClienteDuracionEspera(cliente: Usuario, tiempoEstimado: number): Observable<any> {
    let token = cliente.token;
    let title = `Su pedido está en preparación.`;
    let body = `El tiempo de espera para el pedido es de aproximadamente ${tiempoEstimado} minutos.\nGracias.`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }
}
