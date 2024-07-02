import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoEmpleado } from '../enums/tipo-empleado';
import { Usuario } from '../models/usuario';
import { Pedido } from '../models/pedido';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  MozoPropinaDejada(pedido: Pedido) {
    throw new Error('Method not implemented.');
  }

  private apiUri = environment.apiPushNotificationAndMail;

  constructor(private http: HttpClient) { }


  AltaCliente(usuario: Usuario, role: TipoEmpleado): Observable<any> {
    let title = 'Nuevo Cliente Registrado';
    let body = `Se ha registrado el Cliente ${usuario.nombre} ${usuario.apellido} con el email: ${usuario.email}.`;
    return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }

  MaitreNuevoEnListaEspera(usuario: Usuario): Observable<any> {
    let title = 'Nuevo Cliente en Lista de Espera';
    let body = `El Cliente ${usuario.nombre} ${usuario.apellido} espera por una mesa libre.`;
    let role = TipoEmpleado.Maitre;
    return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }

  MesaAsignada(usuario: Usuario, mesaNro: number): Observable<any> {
    console.log("Enviando a Token:"+usuario.token);
    let token = usuario.token;
    let title = 'Mesa Asignada';
    let body = `Por favor acerquese a la Mesa Nro: ${mesaNro}. Y escanee su código para comenzar a disfrutar de nuestros servicios.`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }

  ChatMozos(mesaNumero: number): Observable<any> {
    let title = `Nuevo mensaje de Mesa ${mesaNumero}`;
    let body = `Nuevo pedido de comida de Mesa ${mesaNumero}. Por favor revisar la lista de pedidos.`;
    let role = TipoEmpleado.Mozo;
    return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }

  CocinerosPedido(producto: Producto, tipo: string): Observable<any> {
    let title: string = `Nuevo pedido de ${tipo}`;
    let body = `Debe preparar el siguiente producto: ${producto.nombre}. Por favor revise la lista de pedidos.`;
    let role = TipoEmpleado.Cocinero;
    return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }
  BartendersPedido(producto: Producto): Observable<any> {
    let title = 'Nuevo pedido de Bebida';
    let body = `Debe preparar la siguiente bebida: ${producto.nombre}. Por favor revise la lista de pedidos.`;
    let role = TipoEmpleado.Bartender;
      return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }
  
  MozoPedidoListo(MozoDelPedido: Usuario, mesaNro: number): Observable<any> {
    let token = MozoDelPedido.token;
    let title = `Pedido Mesa ${mesaNro} Listo`;
    let body = `El pedido de la Mesa Nro: ${mesaNro} se encuestra listo para entregar.`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }

  MozoPedidoCuenta(pedido: Pedido): Observable<any> {
    let token = pedido.mozo!.token;
    let title = `Cierre de Cuenta Mesa ${pedido.mesa.numero}.`;

    let body = `${pedido.cliente.nombre} de la Mesa Nro: ${pedido.mesa.numero} desea cerrar la cuenta por un total de $ ${pedido.total}.`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }

  MozoPagoRealizado(pedido: Pedido): Observable<any> {
    let token = pedido.mozo!.token;
    let title = `Pago realizado Mesa ${pedido.mesa.numero}.`;

    let body = `${pedido.cliente.nombre} de la Mesa Nro: ${pedido.mesa.numero} realizó el pago por un total de $ ${pedido.total}.`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }

  MozosNuevoPedido(mesaNumero: number): Observable<any> {
    let title = `Nueva Pedido de Mesa ${mesaNumero}`;
    let body = `Nuevo pedido de comida de Mesa ${mesaNumero}. Por favor revisar la lista de pedidos.`;
    let role = TipoEmpleado.Mozo;
    return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }

  ClienteDuracionEspera(cliente: Usuario, tiempoEstimado: number): Observable<any> {
    let token = cliente.token;
    let title = `Su pedido está en preparación.`;
    let body = `El tiempo de espera para el pedido es de aproximadamente ${tiempoEstimado} minutos.\nGracias.`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }
  ClienteMozoAceptoPedido(cliente: Usuario, mozoNombre: string): Observable<any> {
    let token = cliente.token;
    let title = 'Su pedido ha sido aceptado por el mozo.';
    let body = `El mozo asignado a su pedido es: ${mozoNombre}.`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }
  ClienteMozoPagoConfirmado(cliente: Usuario, mozoNombre: string): Observable<any> {
    let token = cliente.token;
    let title = 'Pago confirmado.';
    let body = `El mozo ${mozoNombre} ha confirmado su pago. ¡Gracias por elegir a Sabores Unicos!`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }

  ConsultaAMozos(mesaNumero: number, consulta: string): Observable<any> {
    let title = `Nueva consulta de Mesa ${mesaNumero}`;
    let body = `${consulta}`;
    let role = TipoEmpleado.Mozo;
    return this.http.post(`${this.apiUri}/notificar-tipoEmpleado`, { title, body, role }, { responseType: 'text' });
  }

  ConsultaAMesas(cliente: Usuario,nombreMozo: string, respuestaConsulta: string): Observable<any> {
    let token = cliente.token
    let title = `Nuevo mensaje del mozo ${nombreMozo}`;
    let body = `${respuestaConsulta}`;
    return this.http.post(`${this.apiUri}/notificar`, { token, title, body }, { responseType: 'text' });
  }
}
