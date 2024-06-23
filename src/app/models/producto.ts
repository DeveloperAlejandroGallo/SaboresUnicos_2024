import { TipoProducto } from "../enums/tipo-producto";

export interface Producto {

  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempoPreparacionEnMinutos: number; //Minimo 1 minuto
  fotos: Array<string>; //Maximo 3 fotos
  tipo: TipoProducto;

}
