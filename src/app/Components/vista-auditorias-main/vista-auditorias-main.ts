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
  imports: [CommonModule, VistaUserBadge, RouterLink, FormsModule],
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

  private readonly Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

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
    this.Toast.fire({
      icon: 'success',
      title: 'Descarga iniciada',
    });
  }

  cargarAuditorias(): void {
    Swal.fire({
      title: 'Cargando auditorías...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    this.auditoriaService.getAll().subscribe({
      next: (result) => {
        Swal.close();

        if (result.correct) {
          this.auditorias = result.objects.sort(
            (a, b) => new Date(b.fechaOperacion).getTime() - new Date(a.fechaOperacion).getTime(),
          );

          this.aplicarFiltros();

          this.Toast.fire({
            icon: 'success',
            title: `${this.auditorias.length} auditorías cargadas`,
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Sin información',
            text: result.message || 'No se encontraron auditorías.',
          });
        }
      },
      error: (err) => {
        Swal.close();

        this.auditorias = [];

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No fue posible obtener las auditorías.',
        });

        console.error(err);
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
      title: `
      <div class="d-flex align-items-center justify-content-center">
        <i class="bi bi-clock-history text-primary fs-3 me-2"></i>
        <span>Detalle de Auditoría</span>
      </div>
    `,
      html: `
      <div class="container-fluid text-start">

        <div class="card border-0 bg-light mb-3">
          <div class="card-body">

            <div class="row g-3">

              <div class="col-md-6">
                <small class="text-muted">
                  <i class="bi bi-hash me-1 text-primary"></i>Folio
                </small>
                <div class="fw-semibold">${a.idAuditoria}</div>
              </div>

              <div class="col-md-6">
                <small class="text-muted">
                  <i class="bi bi-box-seam me-1 text-success"></i>Producto
                </small>
                <div class="fw-semibold">${a.producto.nombre}</div>
              </div>

              <div class="col-md-6">
                <small class="text-muted">
                  <i class="bi bi-arrow-repeat me-1 text-warning"></i>Operación
                </small>
                <div>
                  <span class="badge bg-primary">
                    ${a.tipoOperacion.nombre}
                  </span>
                </div>
              </div>

              <div class="col-md-6">
                <small class="text-muted">
                  <i class="bi bi-person-fill me-1 text-info"></i>Usuario
                </small>
                <div class="fw-semibold">${a.usuario.username}</div>
              </div>

              <div class="col-12">
                <small class="text-muted">
                  <i class="bi bi-calendar-event me-1 text-danger"></i>Fecha de operación
                </small>
                <div class="fw-semibold">
                  ${new Date(a.fechaOperacion).toLocaleString()}
                </div>
              </div>

            </div>

          </div>
        </div>

        <div class="card border-primary">
          <div class="card-header bg-primary text-white">
            <i class="bi bi-file-earmark-text me-2"></i>
            Descripción del cambio
          </div>

          <div class="card-body">
            <p class="mb-0 text-break">
              ${a.descripcionCambio}
            </p>
          </div>
        </div>

      </div>
    `,
      width: '700px',
      confirmButtonText: '<i class="bi bi-check-circle me-2"></i>Aceptar',
      confirmButtonColor: '#0d6efd',
    });
  }
}
