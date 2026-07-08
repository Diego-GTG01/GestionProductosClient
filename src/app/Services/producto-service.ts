import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../Interfaces/producto';
import { Result } from '../Interfaces/result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  apiUrl = environment.apiUrl + '/producto';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Result<Producto>> {
    return this.http.get<Result<Producto>>(this.apiUrl);
  }
  
}
