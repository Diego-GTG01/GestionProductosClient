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
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Validando tus credenciales con el servidor',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const auth: LoginRequest = {
      username: this.loginForm.value.username!,
      password: this.loginForm.value.password!,
    };

    this.authService.login(auth).subscribe({
      next: (result) => {
        if (result && result.object) {
          sessionStorage.setItem('token', result.object.token);
          sessionStorage.setItem('username', result.object.username);
          sessionStorage.setItem('idUsuario', result.object.idUsuario.toString());

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          });

          Toast.fire({
            icon: 'success',
            title: `¡Bienvenido de nuevo, ${result.object.username}!`
          });

          Swal.close();
          this.router.navigate(['/products']);
        } else {
          this.mostrarErrorAutenticacion();
        }
      },
      error: (err) => {
        console.error(err);
        this.mostrarErrorAutenticacion();
      },
    });
  }

  private mostrarErrorAutenticacion() {
    Swal.fire({
      icon: 'error',
      title: 'Acceso Denegado',
      text: 'El usuario o la contraseña ingresados son incorrectos. Por favor, verifica tus datos.',
      confirmButtonColor: '#dc3545'
    });
  }
}