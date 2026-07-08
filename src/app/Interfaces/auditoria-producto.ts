import { Producto } from "./producto";
import { TipoOperacion } from "./tipo-operacion";
import { Usuario } from "./usuario";

export interface AuditoriaProducto {
    idAuditoria: number;
    producto: Producto;
    tipooperacion: TipoOperacion;
    usuario: Usuario;
    descripcionCambio: string;
    fechaOperacion: Date;


}
