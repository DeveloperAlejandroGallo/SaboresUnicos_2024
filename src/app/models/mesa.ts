import { EstadoMesa } from "../enums/estado-mesa";

export interface Mesa {
    id: string,
    cliente: string | null,
    estado: EstadoMesa,
    numero: number,
    consulta: string | null,
    
  }
  