import { Timestamp } from "firebase/firestore";
import { Mesa } from "./mesa";
import { Usuario } from "./usuario";
import { Producto } from "./producto";
import { EstadoPedido, EstadoPedidoProducto } from "../enums/estado-pedido";

export interface Pedido {
  id: string;
  fechaIngreso: Timestamp;
  mesa: Mesa;
  cliente: Usuario;
  total: number;
  subTotal: number;
  propina: number;
  productos: Array<{producto: Producto, cantidad: number, estadoProducto: EstadoPedidoProducto, empleadoId:string}> ;
  estadoPedido: EstadoPedido | null;
  descuentoPorJuego: number;
  tiempoEstimado: number;
  fechaDePedidoAceptado: Timestamp | null; //Con este calculamos el tiempo de espera
  mozo: Usuario | null;
}
