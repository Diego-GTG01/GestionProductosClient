import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Departamento } from '../Interfaces/departamento';
import { Result } from '../Interfaces/result';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {
  apiUrl = environment.apiUrl + '/departamento';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Result<Departamento>> {
    return this.http.get<Result<Departamento>>(this.apiUrl);
  }
}
