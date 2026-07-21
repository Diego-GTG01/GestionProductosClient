import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Usuario } from '../../Interfaces/usuario';
import { UsuarioService } from '../../Services/usuario-service';
import Swal from 'sweetalert2';
import { VistaUserBadge } from '../vista-user-badge/vista-user-badge';

@Component({
  selector: 'app-vista-user-detail',
  imports: [ VistaUserBadge],
  templateUrl: './vista-user-detail.html',
  styleUrl: './vista-user-detail.css',
})
export class VistaUserDetail implements OnInit {
  idUsuario: number = 0;
  usuario: Usuario = {
    idUsuario: 0,
    username: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    celular: '',
    telefono: '',
    rol: {
      idRol: 0,
      nombre: '',
    },
  };

  constructor(
    private usuarioService: UsuarioService,
    private location: Location,
  ) {}
  ngOnInit(): void {
    this.idUsuario = parseInt(sessionStorage.getItem('idUsuarioActual') ?? '0');
    this.cargarUsuario(this.idUsuario);
  }
  volver() {
    this.location.back();
  }

  cargarUsuario(idUsuario: number) {
    this.usuarioService.getById(idUsuario).subscribe({
      next: (result) => {
        if (result.correct) {
          this.usuario = result.object;
          console.log(this.usuario);
        } else {
          Swal.fire('Opps!', 'Algo salió mal', 'success');
        }
      },
      error: (err) => {
        Swal.fire('error', 'Error inesperado en el servidor', 'error');
      },
    });
  }
}
