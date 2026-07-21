import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../Interfaces/auth-login';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vista-login',
  imports: [ReactiveFormsModule],
  templateUrl: './vista-login.html',
  styleUrl: './vista-login.css',
})
export class VistaLogin {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  private readonly Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor, ingresa tu usuario y contraseña.',
        confirmButtonColor: '#2563eb',
      });

      return;
    }

    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Validando tus credenciales',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    const auth: LoginRequest = {
      username: this.loginForm.value.username!,
      password: this.loginForm.value.password!,
    };

    this.authService.login(auth).subscribe({
      next: (result) => {
        Swal.close();

        if (result?.object) {
          sessionStorage.clear();

          sessionStorage.setItem('token', result.object.token);
          sessionStorage.setItem('username', result.object.username);
          sessionStorage.setItem('idUsuario', result.object.idUsuario.toString());
          sessionStorage.setItem('idUsuarioActual', result.object.idUsuario.toString());
          sessionStorage.setItem('rol', result.object.rol);

          this.Toast.fire({
            icon: 'success',
            title: `¡Bienvenido ${result.object.username}!`,
          });
          this.router.navigate(['/products']).then(() => {
            this.Toast.fire({
              icon: 'success',
              title: `¡Bienvenido ${result.object.username}!`,
            });
          });
        } else {
          this.mostrarErrorAutenticacion();
        }
      },
      error: (err) => {
        Swal.close();

        if (err.status === 401) {
          this.mostrarErrorAutenticacion();
        } else {
          this.mostrarErrorServidor();
        }

        console.error(err);
      },
    });
  }

  private mostrarErrorServidor(): void {
    Swal.fire({
      icon: 'error',
      title: 'Servidor no disponible',
      text: 'No fue posible establecer comunicación con el servidor. Inténtalo nuevamente más tarde.',
      confirmButtonColor: '#dc3545',
    });
  }

  private mostrarErrorAutenticacion(): void {
    Swal.fire({
      icon: 'error',
      title: 'Credenciales incorrectas',
      text: 'El usuario o la contraseña son incorrectos.',
      confirmButtonText: 'Intentar nuevamente',
      confirmButtonColor: '#dc3545',
    });
  }
}
