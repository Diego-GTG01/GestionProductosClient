import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { AuditoriaProducto } from '../../Interfaces/auditoria-producto';
import { AuditoriaService } from '../../Services/auditoria-service';
import { VistaUserBadge } from '../vista-user-badge/vista-user-badge';
import { RouterLink } from '@angular/router';
import { ReporteService } from '../../Services/reporte-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vista-auditorias-main',
  standalone: true,
  imports: [CommonModule, VistaUserBadge, RouterLink, FormsModule ],
  templateUrl: './vista-auditorias-main.html',
  styleUrl: './vista-auditorias-main.css',
})
export class VistaAuditoriasMain implements OnInit {
  auditorias: AuditoriaProducto[] = [];
  auditoriasFiltradas: AuditoriaProducto[] = [];

  vistaTabla = true;

  paginaActual = 1;
  registrosPorPagina = 10;

  mesSeleccionado: string = '';
  anioSeleccionado: string = '';

  meses = [
    { value: '1', nombre: 'Enero' },
    { value: '2', nombre: 'Febrero' },
    { value: '3', nombre: 'Marzo' },
    { value: '4', nombre: 'Abril' },
    { value: '5', nombre: 'Mayo' },
    { value: '6', nombre: 'Junio' },
    { value: '7', nombre: 'Julio' },
    { value: '8', nombre: 'Agosto' },
    { value: '9', nombre: 'Septiembre' },
    { value: '10', nombre: 'Octubre' },
    { value: '11', nombre: 'Noviembre' },
    { value: '12', nombre: 'Diciembre' },
  ];

  anios: number[] = [];

  constructor(
    private auditoriaService: AuditoriaService,
    private reporteService: ReporteService,
  ) {}

  ngOnInit(): void {
    const actual = new Date().getFullYear();

    for (let i = actual; i >= actual - 10; i--) {
      this.anios.push(i);
    }

    this.cargarAuditorias();
  }
  descargar() {
    this.reporteService.cargarReporte();
  }

  cargarAuditorias(): void {
    this.auditoriaService.getAll().subscribe({
      next: (result) => {
        if (result.correct) {
          this.auditorias = result.objects.sort(
            (a, b) => new Date(b.fechaOperacion).getTime() - new Date(a.fechaOperacion).getTime(),
          );

          this.aplicarFiltros();
        }
      },
      error: (err) => {
        this.auditorias = [];
      },
    });
  }

  aplicarFiltros(): void {
    this.auditoriasFiltradas = this.auditorias.filter((a) => {
      const fecha = new Date(a.fechaOperacion);

      const coincideMes =
        !this.mesSeleccionado || fecha.getMonth() + 1 === Number(this.mesSeleccionado);

      const coincideAnio =
        !this.anioSeleccionado || fecha.getFullYear() === Number(this.anioSeleccionado);

      return coincideMes && coincideAnio;
    });

    this.paginaActual = 1;
  }

  limpiarFiltros(): void {
    this.mesSeleccionado = '';
    this.anioSeleccionado = '';
    this.aplicarFiltros();
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
