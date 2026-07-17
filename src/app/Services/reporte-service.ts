import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Reporte } from '../Interfaces/reporte';
import { Result } from '../Interfaces/result';

export interface ProductoReporteFiltros {
  nombre?: string;
  idDepartamento?: number;
  status?: number;
  precioMin?: number;
  precioMax?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  apiUrl = environment.apiUrl + '/reporte';

  private http = inject(HttpClient);

  getReporte(): Observable<Result<Reporte>> {
    return this.http.get<Result<Reporte>>(this.apiUrl);
  }

  cargarReporte(): void {
    this.getReporte().subscribe({
      next: (result) => {
        const reporte = result.object; 

        if (reporte && reporte.file && reporte.fileName) {
          this.procesarYDescargar(reporte);
        } else {
          console.error('El reporte no contiene un archivo o nombre válido.');
        }
      },
      error: (err) => {
        console.error('Error al obtener el reporte:', err);
      },
    });
  }

  getReporteProductosExcel(filtros: ProductoReporteFiltros = {}): Observable<Result<Reporte>> {
    let params = new HttpParams();

    if (filtros.nombre?.trim()) {
      params = params.set('nombre', filtros.nombre.trim());
    }
    if (filtros.idDepartamento != null) {
      params = params.set('idDepartamento', filtros.idDepartamento);
    }
    if (filtros.status != null) {
      params = params.set('status', filtros.status);
    }
    if (filtros.precioMin != null) {
      params = params.set('precioMin', filtros.precioMin);
    }
    if (filtros.precioMax != null) {
      params = params.set('precioMax', filtros.precioMax);
    }

    return this.http.post<Result<Reporte>>(`${this.apiUrl}/productos/excel`, null, { params });
  }

  cargarReporteProductosExcel(filtros: ProductoReporteFiltros = {}, onFinally?: () => void): void {
    this.getReporteProductosExcel(filtros).subscribe({
      next: (result) => {
        const reporte = result.object;

        if (result.correct && reporte && reporte.file && reporte.fileName) {
          this.procesarYDescargar(reporte);
        } else {
          console.error(reporte?.message || 'El reporte no contiene un archivo o nombre válido.');
        }
        onFinally?.();
      },
      error: (err) => {
        console.error('Error al obtener el reporte de productos:', err);
        onFinally?.();
      },
    });
  }

  private procesarYDescargar(reporte: Reporte): void {
    const contentType = this.obtenerMimeType(reporte.fileName);
    const byteCharacters = window.atob(reporte.file);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);


    const file = new File([byteArray], reporte.fileName, { type: contentType });

    const url = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private obtenerMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'application/pdf';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      default: return 'application/octet-stream';
    }
  }
}