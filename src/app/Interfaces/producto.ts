import { Usuario } from "../Interfaces/usuario";
import { Departamento } from "./departamento";
export interface Producto
{
    idProducto: number;
    folio: string;
    clave: string;
    nombre: string;
    descripcion: string;
    precio: number;
    status: number;
    fechaRegistro: Date;
    fechaActualizacion: Date;
    imagen: string;
    departamento: Departamento;
    usuario: Usuario;
}
