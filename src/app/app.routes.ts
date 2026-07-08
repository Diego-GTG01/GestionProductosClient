import { Routes } from '@angular/router';
import { VistaLogin } from './Components/vista-login/vista-login';
import { VistaProductoMain } from './Components/vista-producto-main/vista-producto-main';

export const routes: Routes = [
  {
    path: '',
    component: VistaLogin,
  },
  {
    path:'productos',
    component: VistaProductoMain
  }
];
