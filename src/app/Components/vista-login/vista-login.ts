import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../Interfaces/auth-login';

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
      return;
    }

    const auth: LoginRequest = {
      username: this.loginForm.value.username!,
      password: this.loginForm.value.password!,
    };

    this.authService.login(auth).subscribe({
      next: (result) => {
        if (result) {
          console.log(result)
          sessionStorage.setItem('token', result.object.token);
          sessionStorage.setItem('username', result.object.username);
          sessionStorage.setItem('idUsuario', result.object.idUsuario.toString());
          this.router.navigate(['/products']);
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Usuario o contraseña incorrectos');
      },
    });
  }
}
