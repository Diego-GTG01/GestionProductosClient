import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vista-user-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vista-user-badge.html',
  styleUrl: './vista-user-badge.css',
})
export class VistaUserBadge {
  username: string = '';
  token: string = '';
  idUsuario: number = 0;
  rol: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') ?? '';
    this.token = sessionStorage.getItem('token') ?? '';
    this.idUsuario = Number(sessionStorage.getItem('idUsuario')) ?? 0;

    this.rol = sessionStorage.getItem('rol') ?? '';

    if (this.token !== '') {
      this.authService.validateToken().subscribe({
        next: (result) => {
          if (result) {
            console.log('Token válido');
            console.log(this.idUsuario);
          }
        },
        error: () => {
          sessionStorage.clear();

          Swal.fire({
            icon: 'warning',
            title: 'Sesión expirada',
            text: 'Tu sesión ha caducado. Inicia sesión nuevamente.',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            this.router.navigate(['/']);
          });
        },
      });
    } else {
      this.router.navigate(['/']);
    }
  }
  verPerfil() {
    if (this.router.url === '/user-detail') {
      window.location.reload();
    }
    sessionStorage.removeItem('idUsuarioActual');
    sessionStorage.setItem('idUsuarioActual', String(this.idUsuario));
    console.log(String(this.idUsuario));
    this.router.navigate(['/user-detail']);
  }

  logout(): void {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Deseas cerrar tu sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();

        this.router.navigate(['/']);

        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }
}
