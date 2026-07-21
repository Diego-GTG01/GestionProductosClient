import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../Services/producto-service';
import { Producto } from '../../Interfaces/producto';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { VistaUserBadge } from '../vista-user-badge/vista-user-badge';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../Services/reporte-service';

@Component({
  selector: 'app-vista-producto-main',
  imports: [CurrencyPipe, DatePipe, RouterLink, VistaUserBadge, FormsModule],
  templateUrl: './vista-producto-main.html',
  styleUrl: './vista-producto-main.css',
})
export class VistaProductoMain implements OnInit {
  idUsuario: number = 0;
  rol: string = '';

  productos: Producto[] = [];
  statusFiltro: number = 1;
  productosFiltrados: Producto[] = [];
  tipoOrden: string = 'fechaDesc';

  nombreFiltro: string = '';
  claveFiltro: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;

  descargandoReporte = false;

  paginaActual = 1;
  elementosPorPagina = 10;

  private readonly DURACION_MIN_SWAL = 600;

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
    private productoService: ProductoService,
    private reporteService: ReporteService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.idUsuario = Number(sessionStorage.getItem('idUsuario')) ?? 0;
    this.rol = sessionStorage.getItem('rol') ?? '';
    localStorage.removeItem('producto');
    this.cargarProductos();
  }

  get esAdmin(): boolean {
    return this.rol === 'ADMINISTRADOR';
  }

  get productosActivos(): Producto[] {
    return this.productos.filter((p) => p.status === 1);
  }

  get productosInactivos(): Producto[] {
    return this.productos.filter((p) => p.status !== 1);
  }

  get productosMostrar(): Producto[] {
    let lista = [...this.productos];

    if (this.statusFiltro !== 3) {
      lista = lista.filter((p) => p.status === this.statusFiltro);
    }

    if (this.nombreFiltro.trim()) {
      lista = lista.filter((p) =>
        p.nombre.toLowerCase().includes(this.nombreFiltro.toLowerCase())
      );
    }

    if (this.claveFiltro.trim()) {
      lista = lista.filter((p) =>
        p.clave.toLowerCase().includes(this.claveFiltro.toLowerCase())
      );
    }

    if (this.precioMin != null) {
      lista = lista.filter((p) => p.precio >= this.precioMin!);
    }

    if (this.precioMax != null) {
      lista = lista.filter((p) => p.precio <= this.precioMax!);
    }

    switch (this.tipoOrden) {
      case 'fechaDesc':
        lista.sort(
          (a, b) =>
            new Date(b.fechaRegistro).getTime() -
            new Date(a.fechaRegistro).getTime()
        );
        break;

      case 'fechaAsc':
        lista.sort(
          (a, b) =>
            new Date(a.fechaRegistro).getTime() -
            new Date(b.fechaRegistro).getTime()
        );
        break;

      case 'nombreAsc':
        lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;

      case 'nombreDesc':
        lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }

    return lista;
  }

  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.productosMostrar.slice(inicio, inicio + this.elementosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosMostrar.length / this.elementosPorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  filtrar(): void {
    this.paginaActual = 1;
  }

  cambiarTab(status: number): void {
    if (!this.esAdmin && status !== 1) {
      return;
    }

    this.statusFiltro = status;
    this.paginaActual = 1;
  }

  private abrirCargando(title: string) {
    const inicio = Date.now();
    const promesa = Swal.fire({
      title,
      text: 'Espera un momento.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    return { promesa, inicio };
  }
private cerrarYLuego(
    loading: { promesa: Promise<any>; inicio: number },
    accion: () => void
  ): void {
    const transcurrido = Date.now() - loading.inicio;
    const espera = Math.max(0, this.DURACION_MIN_SWAL - transcurrido);

    setTimeout(() => {
      Swal.close();
      loading.promesa.then(() => accion());
    }, espera);
  }

  descargarReporteExcel(): void {
    if (!this.esAdmin || this.descargandoReporte) {
      return;
    }

    this.descargandoReporte = true;

    const loading = this.abrirCargando('Generando reporte...');

    this.reporteService.cargarReporteProductosExcel(
      {
        nombre: this.nombreFiltro,
        status: this.statusFiltro !== 3 ? this.statusFiltro : undefined,
        precioMin: this.precioMin ?? undefined,
        precioMax: this.precioMax ?? undefined,
      },
      () => {
        this.descargandoReporte = false;

        this.cerrarYLuego(loading, () => {
          this.Toast.fire({
            icon: 'success',
            title: 'Reporte descargado correctamente',
          });
        });
      }
    );
  }

  cargarProductos(silencioso: boolean = false): void {
    const loading = silencioso ? null : this.abrirCargando('Cargando productos...');

    this.productoService.getAll().subscribe({
      next: (result) => {
        const aplicar = () => {
          if (result.correct) {
            this.productos = result.objects;
          } else if (!silencioso) {
            Swal.fire({
              icon: 'warning',
              title: 'Sin información',
              text: result.message || 'No se encontraron productos.',
            });
          } else {
            this.productos = result.objects ?? this.productos;
          }
        };

        if (loading) {
          this.cerrarYLuego(loading, aplicar);
        } else {
          aplicar();
        }
      },
      error: (err) => {
        console.error(err);

        if (loading) {
          this.cerrarYLuego(loading, () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No fue posible obtener los productos.',
            });
          });
        }
      },
    });
  }

  verDetalle(producto: Producto): void {
    localStorage.setItem('producto', JSON.stringify(producto));
    this.router.navigate(['/detail-product']);
  }

  editar(producto: Producto): void {
    if (!this.esAdmin) {
      return;
    }

    this.productoService.editarProducto(producto).then((productoEditado) => {
      if (!productoEditado) {
        return;
      }

      const loading = this.abrirCargando('Actualizando producto...');

      this.productoService.update(productoEditado).subscribe({
        next: () => {
          this.cerrarYLuego(loading, () => {
            this.Toast.fire({
              icon: 'success',
              title: 'Producto actualizado correctamente',
              timer: 3000,
            });

            this.cargarProductos(true);
          });
        },
        error: () => {
          this.cerrarYLuego(loading, () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No fue posible actualizar el producto.',
            });
          });
        },
      });
    });
  }

  editarImagen(producto: Producto): void {
    if (!this.esAdmin) {
      return;
    }

    this.productoService.editarImagenProducto(producto).then((productoEditado) => {
      if (!productoEditado) {
        return;
      }

      this.Toast.fire({
        icon: 'success',
        title: 'Imagen actualizada correctamente',
        timer: 3000,
      });

      this.cargarProductos(true);
    });
  }

  deleteProducto(producto: Producto): void {
    if (!this.esAdmin) {
      return;
    }

    const activar = producto.status === 0;

    Swal.fire({
      title: activar ? '¿Activar producto?' : '¿Desactivar producto?',
      text: activar
        ? `Se activará "${producto.nombre}".`
        : `Se desactivará "${producto.nombre}".`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: activar ? '#198754' : '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: activar ? 'Sí, activar' : 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const loading = this.abrirCargando(
        activar ? 'Activando producto...' : 'Desactivando producto...'
      );

      this.productoService.delete(producto.idProducto, this.idUsuario).subscribe({
        next: (response) => {
          this.cerrarYLuego(loading, () => {
            if (response.correct) {
              this.Toast.fire({
                icon: 'success',
                title: activar
                  ? 'Producto activado correctamente'
                  : 'Producto desactivado correctamente',
                timer: 3000,
              });

              this.cargarProductos(true);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text:
                  response.message ||
                  'No fue posible actualizar el estado del producto.',
              });
            }
          });
        },
        error: (err) => {
          this.cerrarYLuego(loading, () => {
            Swal.fire({
              icon: 'error',
              title: 'Error del servidor',
              text: 'Ocurrió un error al intentar actualizar el estado del producto.',
            });

            console.error(err);
          });
        },
      });
    });
  }
}