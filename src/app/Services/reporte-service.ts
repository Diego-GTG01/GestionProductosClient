import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Reporte } from '../Interfaces/reporte';
import { Result } from '../Interfaces/result';

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
      
      default: return 'application/octet-stream';
    }
  }
}
