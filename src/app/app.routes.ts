import { Routes } from '@angular/router';
import { VistaLogin } from './Components/vista-login/vista-login';
import { VistaProductoMain } from './Components/vista-producto-main/vista-producto-main';
import { VistaDetalleProducto } from './Components/vista-detalle-producto/vista-detalle-producto';

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
  }
];
