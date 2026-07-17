import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Departamento } from '../../Interfaces/departamento';
import { DepartamentoService } from '../../Services/departamento-service';
import { VistaUserBadge } from '../vista-user-badge/vista-user-badge';

@Component({
  selector: 'app-vista-departamentos-main',
  standalone: true,
  imports: [CommonModule, FormsModule, VistaUserBadge],
  templateUrl: './vista-departamentos-main.html',
  styleUrl: './vista-departamentos-main.css',
})
export class VistaDepartamentosMain implements OnInit {
  departamentos: Departamento[] = [];

  // Filtros
  nombreFiltro = '';
  prefijoFiltro = '';
  statusFiltro = 1;

  // Paginación
  paginaActual = 1;
  itemsPorPagina = 8;

  constructor(private departamentoService: DepartamentoService) {}

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos(): void {
    this.departamentoService.getAll().subscribe({
      next: (result) => {
        
        this.departamentos = result?.objects ?? result ?? [];
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los departamentos.',
        });
      },
    });
  }

  get departamentosActivos(): Departamento[] {
    return this.departamentos.filter((d) => d.status === 1);
  }

  get departamentosInactivos(): Departamento[] {
    return this.departamentos.filter((d) => d.status !== 1);
  }

  get departamentosFiltrados(): Departamento[] {
    const lista =
      this.statusFiltro === 1 ? this.departamentosActivos : this.departamentosInactivos;

    return lista.filter((d) => {
      const coincideNombre = d.nombre
        ?.toLowerCase()
        .includes(this.nombreFiltro.trim().toLowerCase());
      const coincidePrefijo = d.prefijo
        ?.toLowerCase()
        .includes(this.prefijoFiltro.trim().toLowerCase());
      return coincideNombre && coincidePrefijo;
    });
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.departamentosFiltrados.length / this.itemsPorPagina));
  }

  get departamentosPaginados(): Departamento[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.departamentosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  filtrar(): void {
    this.paginaActual = 1;
  }

  cambiarTab(status: number): void {
    this.statusFiltro = status;
    this.paginaActual = 1;
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  verDetalle(departamento: Departamento): void {
    Swal.fire({
      title: departamento.nombre,
      html: `
        <div class="text-start">
          <p class="mb-2"><strong>Prefijo:</strong> ${departamento.prefijo}</p>
          <p class="mb-2"><strong>Estatus:</strong>
            <span class="badge ${departamento.status === 1 ? 'bg-success' : 'bg-danger'}">
              ${departamento.status === 1 ? 'Activo' : 'Inactivo'}
            </span>
          </p>
          <p class="mb-0"><strong>Descripción:</strong><br>${
            departamento.descripcion?.trim() ? departamento.descripcion : 'Sin descripción'
          }</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#0d6efd',
    });
  }

  agregarDepartamento(): void {
    Swal.fire({
      title: 'Nuevo Departamento',
      html: `
        <div class="text-start">
          <label class="form-label fw-semibold small mb-1">Nombre</label>
          <input id="swal-nombre" class="form-control mb-3" placeholder="Ej. Recursos Humanos" maxlength="100">

          <label class="form-label fw-semibold small mb-1">Prefijo</label>
          <input id="swal-prefijo" class="form-control mb-3" placeholder="Ej. RH" maxlength="10">

          <label class="form-label fw-semibold small mb-1">Descripción</label>
          <textarea id="swal-descripcion" class="form-control" rows="3" placeholder="Descripción del departamento"></textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value.trim();
        const prefijo = (
          document.getElementById('swal-prefijo') as HTMLInputElement
        ).value.trim();
        const descripcion = (
          document.getElementById('swal-descripcion') as HTMLTextAreaElement
        ).value.trim();

        if (!nombre || !prefijo) {
          Swal.showValidationMessage('El nombre y el prefijo son obligatorios');
          return false;
        }

        return { nombre, prefijo, descripcion };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nuevoDepartamento: Departamento = {
          idDepartamento: 0,
          nombre: result.value.nombre,
          prefijo: result.value.prefijo,
          descripcion: result.value.descripcion,
          status: 1,
        };

        this.departamentoService.add(nuevoDepartamento).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Departamento agregado',
              timer: 1500,
              showConfirmButton: false,
            });
            this.cargarDepartamentos();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo agregar el departamento.',
            });
          },
        });
      }
    });
  }


  editar(departamento: Departamento): void {
    Swal.fire({
      title: 'Editar Departamento',
      html: `
        <div class="text-start">
          <label class="form-label fw-semibold small mb-1">Nombre</label>
          <input id="swal-nombre" class="form-control mb-3" maxlength="100" value="${
            departamento.nombre ?? ''
          }">

          <label class="form-label fw-semibold small mb-1">Prefijo</label>
          <input id="swal-prefijo" class="form-control mb-3" maxlength="10" value="${
            departamento.prefijo ?? ''
          }">

          <label class="form-label fw-semibold small mb-1">Descripción</label>
          <textarea id="swal-descripcion" class="form-control" rows="3">${
            departamento.descripcion ?? ''
          }</textarea>

          <label class="form-label fw-semibold small mb-1 mt-3">Estatus</label>
          <select id="swal-status" class="form-select">
            <option value="1" ${departamento.status === 1 ? 'selected' : ''}>Activo</option>
            <option value="0" ${departamento.status !== 1 ? 'selected' : ''}>Inactivo</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value.trim();
        const prefijo = (
          document.getElementById('swal-prefijo') as HTMLInputElement
        ).value.trim();
        const descripcion = (
          document.getElementById('swal-descripcion') as HTMLTextAreaElement
        ).value.trim();
        const status = Number(
          (document.getElementById('swal-status') as HTMLSelectElement).value
        );

        if (!nombre || !prefijo) {
          Swal.showValidationMessage('El nombre y el prefijo son obligatorios');
          return false;
        }

        return { nombre, prefijo, descripcion, status };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const departamentoActualizado: Departamento = {
          ...departamento,
          nombre: result.value.nombre,
          prefijo: result.value.prefijo,
          descripcion: result.value.descripcion,
          status: result.value.status,
        };

        this.departamentoService.update(departamentoActualizado).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Departamento actualizado',
              timer: 1500,
              showConfirmButton: false,
            });
            this.cargarDepartamentos();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el departamento.',
            });
          },
        });
      }
    });
  }


  cambiarEstatus(departamento: Departamento): void {
    const activar = departamento.status !== 1;

    Swal.fire({
      title: activar ? '¿Reactivar departamento?' : '¿Desactivar departamento?',
      text: `Esta acción cambiará el estatus de "${departamento.nombre}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: activar ? 'Sí, reactivar' : 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: activar ? '#198754' : '#dc3545',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) {
        

        this.departamentoService.delete(departamento.idDepartamento).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: activar ? 'Departamento reactivado' : 'Departamento desactivado',
              timer: 1500,
              showConfirmButton: false,
            });
            this.cargarDepartamentos();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el estatus del departamento.',
            });
          },
        });
      }
    });
  }
}