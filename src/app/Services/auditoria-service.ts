import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { AuditoriaProducto } from '../Interfaces/auditoria-producto';
import { Result } from '../Interfaces/result';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  apiUrl = environment.apiUrl + '/audit';
  auditorias: AuditoriaProducto[] = [];
  private http = inject(HttpClient);

  getAll(): Observable<Result<AuditoriaProducto>> {
    return this.http.get<Result<AuditoriaProducto>>(this.apiUrl);
  }

  cargarAuditorias(): AuditoriaProducto[] {
    this.getAll().subscribe({
      next: (result) => {
        if (result.correct) {
          console.log("Auditorias obtenidas")
          this.auditorias = result.objects;
        }
      },
      error: (err) => {
        this.auditorias = [];
      },
    });
    return this.auditorias;
  }
}
