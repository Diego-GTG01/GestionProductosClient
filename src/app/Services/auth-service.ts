import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../Interfaces/login-response';
import { Result } from '../Interfaces/result';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../Interfaces/auth-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl+'/auth'

  private http = inject(HttpClient);

  login(login: LoginRequest): Observable<Result<LoginResponse>>{
    return this.http.post<Result<LoginResponse>>(this.apiUrl+'/login', login);
  }

  validateToken(): Observable<boolean>{
    return this.http.get<boolean>(this.apiUrl+'/validate');
  }
  
}
