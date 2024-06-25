import { Timestamp } from "firebase/firestore";
import { Mesa } from "./mesa";
import { Usuario } from "./usuario";
import { Producto } from "./producto";
import { EstadoPedido } from "../enums/estado-pedido";

export interface Pedido {
  id: string;
  fechaIngreso: Timestamp;
  mesa: Mesa;
  cliente: Usuario;
  total: number;
  subTotal: number;
  propina: number;
  productos: Array<{producto: Producto, cantidad: number}>;
  estadoPedido: EstadoPedido;
  descuentoPorJuego: number;
  tiempoEstimado: number;
  fechaDePedidoAceptado: Timestamp; //Con este calculamos el tiempo de espera
  mozo: Usuario;
}
