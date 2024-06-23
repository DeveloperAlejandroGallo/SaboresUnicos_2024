import { Timestamp } from "firebase/firestore";
import { Usuario } from "./usuario";

export interface ListaEspera {
    id: string;
    usuario: Usuario;
    fecha_ingreso: Timestamp;
}
