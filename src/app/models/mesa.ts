import { EstadoMesa } from "../enums/estado-mesa";

export interface Mesa {
    id: string,
    cliente_uid: string,
    estado: EstadoMesa,
    numero: string,
    nombre_cliente: string | null,
    cant_asientos: string
    //consulta: string | null,
    
  }
  