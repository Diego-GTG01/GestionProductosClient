import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Rol } from '../Interfaces/rol';
import { Result } from '../Interfaces/result';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  apiUrl = environment.apiUrl + '/role';
  private http = inject(HttpClient);

  getAll(): Observable<Result<Rol>> {
    return this.http.get<Result<Rol>>(this.apiUrl);
  }
}
