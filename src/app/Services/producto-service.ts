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

  getById(): Observable<Result<Producto>> {
    return this.http.get<Result<Producto>>(this.apiUrl);
  }

  getByFolio(): Observable<Result<Producto>> {
    return this.http.get<Result<Producto>>(this.apiUrl);
  }
  getByClave(): Observable<Result<Producto>> {
    return this.http.get<Result<Producto>>(this.apiUrl);
  }
  add(producto: Producto): Observable<Result<Producto>> {
    return this.http.post<Result<Producto>>(this.apiUrl, producto);
  }
  update(producto: Producto): Observable<Result<Producto>> {
    return this.http.put<Result<Producto>>(this.apiUrl, producto);
  }
  delete(idProducto: number): Observable<Result<Producto>> {
    return this.http.get<Result<Producto>>(this.apiUrl + '?idProducto=' + idProducto);
  }
}
