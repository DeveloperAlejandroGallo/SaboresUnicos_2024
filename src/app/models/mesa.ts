import { Timestamp } from "firebase/firestore";
import { Usuario } from "./usuario";
import { EstadoMesa } from "../enums/estado-mesa";

export interface Mesa {
  id: string;
  asientos: number;
  estado: EstadoMesa;
  numero: number;
}
