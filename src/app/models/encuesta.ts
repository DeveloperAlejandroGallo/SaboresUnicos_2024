import { Timestamp } from "firebase/firestore";
import { Usuario } from "./usuario";
import { Producto } from "./producto";

export interface Encuesta {
  id: string;
  cliente: Usuario;
  fecha: Timestamp; // solo 1 por dia
  fotos: Array<string>; //Maximo 3 fotos
  comentario: string; //Input de texto - Comentario.
  cantidadEstrellas: number; //Input de 1 a 5 - Servicio Total. Deben ser 5 imagenes responsive
  SaborDeLaComida: number; //Range de 1 a 10 - Sabor de la comida.
  RecomendariasElLugar: boolean; //Radio Button - Si o No - Volverias a visitarnos.
  QueCosasAgradaron: Array<{cosa: string; si: boolean}>; //Checkbox - Que cosas te agradaron. [comida; tragos; atencion; lugar; precio; otros]
  MejorComida: Array<Producto>; //Select - Con nombre de producto tipo comida.

}
