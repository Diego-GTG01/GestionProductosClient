import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../Interfaces/usuario'; 
import { Result } from '../Interfaces/result';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/user`;
  private http = inject(HttpClient);

  getAll(): Observable<Result<Usuario>> {
    return this.http.get<Result<Usuario>>(this.apiUrl);
  }
  getById(idUsuario: number):Observable<Result<Usuario>> {
    return this.http.get<Result<Usuario>>(this.apiUrl+'?idUsuario='+idUsuario);
  }

  add(usuario: Usuario): Observable<Result<Usuario>> {
    return this.http.post<Result<Usuario>>(this.apiUrl, usuario);
  }

  update(usuario: Usuario): Observable<Result<Usuario>> {
    return this.http.put<Result<Usuario>>(`${this.apiUrl}/${usuario.idUsuario}`, usuario);
  }

  delete(idUsuario: number): Observable<Result<Usuario>> {
    return this.http.delete<Result<Usuario>>(`${this.apiUrl}/${idUsuario}`);
  }
}