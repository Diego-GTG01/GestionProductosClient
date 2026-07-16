import { Rol } from './rol';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  username: string;
  email: string;
  celular: string;
  telefono: string;
  password?: string;
  rol: Rol;
  status?: number;
}
