import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { AuditoriaProducto } from '../../Interfaces/auditoria-producto';
import { AuditoriaService } from '../../Services/auditoria-service';
import { VistaUserBadge } from '../vista-user-badge/vista-user-badge';
import { RouterLink } from '@angular/router';
import { ReporteService } from '../../Services/reporte-service';

@Component({
  selector: 'app-vista-auditorias-main',
  standalone: true,
  imports: [CommonModule, VistaUserBadge, RouterLink],
  templateUrl: './vista-auditorias-main.html',
  styleUrl: './vista-auditorias-main.css',
})
export class VistaAuditoriasMain implements OnInit {
  auditorias: AuditoriaProducto[] = [];
  auditoriasFiltradas: AuditoriaProducto[] = [];

  vistaTabla = true;

  paginaActual = 1;
  registrosPorPagina = 10;

  constructor(
    private auditoriaService: AuditoriaService,
    private reporteService: ReporteService,
  ) {}

  ngOnInit(): void {
    this.cargarAuditorias();
    console.log(this.auditorias);
  }
  descargar() {
    this.reporteService.cargarReporte();
  }

  cargarAuditorias(): void {
    this.auditoriaService.getAll().subscribe({
      next: (result) => {
        if (result.correct) {
          console.log('Auditorias obtenidas');
          this.auditorias = result.objects.sort((a, b) => a.idAuditoria - b.idAuditoria);
          this.auditoriasFiltradas = [...this.auditorias];
          console.log(this.auditoriasFiltradas);
        }
      },
      error: (err) => {
        this.auditorias = [];
      },
    });
  }

  cambiarVista(tabla: boolean) {
    this.vistaTabla = tabla;
  }

  get totalPaginas(): number {
    return Math.ceil(this.auditoriasFiltradas.length / this.registrosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get auditoriasPagina(): AuditoriaProducto[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.auditoriasFiltradas.slice(inicio, inicio + this.registrosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  anterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  siguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  badge(tipo: string): string {
    if (tipo == 'ALTA') return 'bg-success';
    if (tipo == 'MODIFICACION') return 'bg-warning';
    if (tipo == 'DESACTIVACION') return 'bg-danger';
    if (tipo == 'ACTIVACION') return 'bg-primary';

    return 'bg-secondary';
  }

  detalle(a: AuditoriaProducto) {
    Swal.fire({
      title: 'Detalle de Auditoría',
      html: `
      <div class="text-start">
      <p><b>Folio:</b> ${a.idAuditoria}</p>
      <p><b>Producto:</b> ${a.producto.nombre}</p>
      <p><b>Operación:</b> ${a.tipoOperacion.nombre}</p>
      <p><b>Usuario:</b> ${a.usuario.username}</p>
      <p><b>Fecha:</b> ${new Date(a.fechaOperacion).toLocaleString()}</p>
      <hr>
      <p>${a.descripcionCambio}</p>
      </div>

      `,

      confirmButtonText: 'Aceptar',
    });
  }
}
