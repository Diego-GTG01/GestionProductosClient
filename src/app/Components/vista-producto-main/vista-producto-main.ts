import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../Services/producto-service';
import { Producto } from '../../Interfaces/producto';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { VistaUserBadge } from '../vista-user-badge/vista-user-badge';

@Component({
  selector: 'app-vista-producto-main',
  imports: [CurrencyPipe, DatePipe, RouterLink, VistaUserBadge],
  templateUrl: './vista-producto-main.html',
  styleUrl: './vista-producto-main.css',
})
export class VistaProductoMain implements OnInit {
  idUsuario: number = 0;
  constructor(
    private productoService: ProductoService,
    private router: Router,
  ) {}
  productos: Producto[] = [];
  statusFiltro: number = 1;
  ngOnInit(): void {
    this.idUsuario = Number(sessionStorage.getItem('idUsuario')) ?? 0;
    localStorage.removeItem('producto');
    this.cargarProductos();
  }

  get productosActivos(): Producto[] {
    return this.productos.filter((p) => p.status === 1);
  }

  get productosInactivos(): Producto[] {
    return this.productos.filter((p) => p.status !== 1);
  }

  cambiarTab(status: number): void {
    this.statusFiltro = status;
  }

  cargarProductos(): void {
    this.productoService.getAll().subscribe({
      next: (result) => {
        if (result.correct) {
          this.productos = result.objects;
          console.log(this.productos);
        } else {
          console.error(result);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  verDetalle(producto: Producto) {
    localStorage.setItem('producto', JSON.stringify(producto));
    this.router.navigate(['/detail-product']);
  }

  editar(producto: Producto) {
    this.productoService.editarProducto(producto).then((productoEditado) => {
      if (productoEditado) {
        this.productoService.update(productoEditado).subscribe((resp) => {
          Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success').then(() => {
            this.cargarProductos();
          });
        });
      }
    });
  }

  editarImagen(producto: Producto) {
    this.productoService.editarImagenProducto(producto).then((productoEditado) => {
      if (productoEditado) {
        console.log('Producto actualizado correctamente:', productoEditado);
        this.cargarProductos();
      }
    });
  }

  deleteProducto(producto: Producto): void {
    const activar = producto.status === 0;

    Swal.fire({
      title: activar ? '¿Activar producto?' : '¿Desactivar producto?',
      text: activar ? `Se activará "${producto.nombre}".` : `Se desactivará "${producto.nombre}".`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: activar ? '#198754' : '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: activar ? 'Sí, activar' : 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.productoService.delete(producto.idProducto, this.idUsuario).subscribe({
          next: (response) => {
            if (response.correct) {
              Swal.fire({
                icon: 'success',
                title: activar ? 'Producto activado' : 'Producto desactivado',
                text: activar
                  ? 'El producto se activó correctamente.'
                  : 'El producto se desactivó correctamente.',
                timer: 1800,
                showConfirmButton: false,
              });

              this.cargarProductos();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message || 'No fue posible actualizar el estado del producto.',
              });
            }
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error del servidor',
              text: 'Ocurrió un error al intentar actualizar el estado del producto.',
            });
          },
        });
      }
    });
  }
}
