import { Routes } from '@angular/router';
import { VistaLogin } from './Components/vista-login/vista-login';
import { VistaProductoMain } from './Components/vista-producto-main/vista-producto-main';
import { VistaDetalleProducto } from './Components/vista-detalle-producto/vista-detalle-producto';
import { VistaAddProducto } from './Components/vista-add-producto/vista-add-producto';
import { VistaAuditoriasMain } from './Components/vista-auditorias-main/vista-auditorias-main';

export const routes: Routes = [
  {
    path: '',
    component: VistaLogin,
  },
  {
    path:'products',
    component: VistaProductoMain
  },
  {
    path:'detail-product',
    component: VistaDetalleProducto
  },{
    path: 'add-product',
    component: VistaAddProducto
  },{
    path: 'audits',
    component: VistaAuditoriasMain
  }
];
