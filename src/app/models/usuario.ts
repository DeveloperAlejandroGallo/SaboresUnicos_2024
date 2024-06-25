import { EstadoCliente } from "../enums/estado-cliente";
import { Perfil } from "../enums/perfil";
import { TipoEmpleado } from "../enums/tipo-empleado";




export interface Usuario {
  id: string,
  email: string,
  nombre: string,
  apellido: string,
  clave: string,
  foto: string,
  dni: number,
  cuil: string,
  perfil: Perfil,
  tipoEmpleado?: TipoEmpleado | null,
  estado: EstadoCliente,
  mesaAsignada: number,
  tieneReserva: boolean,
  token: string
}
