import { Component, OnInit } from '@angular/core';
import { Producto } from '../../Interfaces/producto';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { VistaUserBadge } from '../vista-user-badge/vista-user-badge';
import { ProductoService } from '../../Services/producto-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vista-detalle-producto',
  imports: [RouterLink, CurrencyPipe, DatePipe, VistaUserBadge],
  templateUrl: './vista-detalle-producto.html',
  styleUrl: './vista-detalle-producto.css',
})
export class VistaDetalleProducto implements OnInit {
  producto!: Producto;
  rol: string = '';

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
    private router: Router,
    private productoService: ProductoService,
  ) {}

  ngOnInit(): void {
    this.rol = sessionStorage.getItem('rol') ?? '';

    const producto = localStorage.getItem('producto');
    if (producto) {
      this.producto = JSON.parse(producto);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Producto no encontrado',
        text: 'No fue posible obtener la información del producto.',
      }).then(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  get esAdmin(): boolean {
    return this.rol === 'ADMINISTRADOR';
  }

  abrirEditarProducto(): void {
    if (!this.esAdmin) {
      return;
    }

    const copiaProducto = JSON.parse(JSON.stringify(this.producto));

    this.productoService.editarProducto(copiaProducto).then((productoModificado) => {
      if (!productoModificado) {
        return;
      }

      Swal.fire({
        title: 'Actualizando producto...',
        text: 'Espera un momento.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      this.productoService.update(productoModificado).subscribe({
        next: (response) => {
          Swal.close();

          if (response.correct) {
            let productoActualizado: Producto;

            if (response.object) {
              productoActualizado = response.object;
            } else {
              const depSeleccionado = this.productoService.opcionesDepartamento.find(
                (d) => d.idDepartamento === Number(productoModificado.departamento.idDepartamento),
              );

              productoActualizado = {
                ...productoModificado,
                departamento: depSeleccionado || productoModificado.departamento,
              };
            }

            this.producto = productoActualizado;
            localStorage.setItem('producto', JSON.stringify(productoActualizado));

            this.Toast.fire({
              icon: 'success',
              title: 'Producto actualizado correctamente',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo actualizar',
              text: response.message || 'Ocurrió un error.',
            });
          }
        },
        error: (err) => {
          Swal.close();

          Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            text: 'Hubo un problema al comunicarse con el servidor.',
          });

          console.error(err);
        },
      });
    });
  }

  abrirEditarImagen(): void {
    if (!this.esAdmin) {
      return;
    }

    this.productoService.editarImagenProducto(this.producto).then((productoConNuevaImagen) => {
      if (!productoConNuevaImagen) {
        return;
      }

      Swal.fire({
        title: 'Actualizando imagen...',
        text: 'Espera un momento.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      this.productoService.update(productoConNuevaImagen).subscribe({
        next: (response) => {
          Swal.close();

          if (response.correct) {
            this.producto = response.object ?? productoConNuevaImagen;
            localStorage.setItem('producto', JSON.stringify(this.producto));

            this.Toast.fire({
              icon: 'success',
              title: 'Imagen actualizada correctamente',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo actualizar la imagen',
              text: response.message,
            });
          }
        },
        error: () => {
          Swal.close();

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al actualizar la imagen.',
          });
        },
      });
    });
  }
}
