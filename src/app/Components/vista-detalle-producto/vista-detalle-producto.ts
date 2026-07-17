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

  constructor(
    private router: Router,
    private productoService: ProductoService 
  ) {}

  ngOnInit(): void {
    const producto = localStorage.getItem('producto');
    if (producto) {
      this.producto = JSON.parse(producto);
    } else {
      this.router.navigate(['/products']);
    }
  }

  // 1. Método para editar información de texto y departamento
  abrirEditarProducto(): void {
    // Hacemos una copia profunda del producto para evitar mutar el estado antes de guardar
    const copiaProducto = JSON.parse(JSON.stringify(this.producto));

    this.productoService.editarProducto(copiaProducto).then((productoModificado) => {
      if (productoModificado) {
        Swal.showLoading();

        this.productoService.update(productoModificado).subscribe({
          next: (response) => {
            if (response.correct) {
              Swal.fire('¡Éxito!', 'El producto ha sido actualizado.', 'success');

              let productoActualizado: Producto;

              if (response.object) {
                productoActualizado = response.object;
              } else {
                const depSeleccionado = this.productoService.opcionesDepartamento.find(
                  (d) => d.idDepartamento === Number(productoModificado.departamento.idDepartamento)
                );
                
                productoActualizado = {
                  ...productoModificado,
                  departamento: depSeleccionado || productoModificado.departamento,
                };
              }

              this.producto = productoActualizado;
              localStorage.setItem('producto', JSON.stringify(productoActualizado));
            } else {
              Swal.fire('Error', response.message || 'No se pudo actualizar el producto.', 'error');
            }
          },
          error: (err) => {
            Swal.fire('Error', 'Hubo un fallo en la comunicación con el servidor.', 'error');
            console.error(err);
          }
        });
      }
    });
  }

  // 2. Método para cambiar la imagen
  abrirEditarImagen(): void {
    // Tu servicio ya ejecuta la petición PATCH internamente al subir la imagen
    this.productoService.editarImagenProducto(this.producto).then((productoConNuevaImagen) => {
      if (productoConNuevaImagen) {
        // Actualizamos el estado del componente
        this.producto = { ...productoConNuevaImagen };
        localStorage.setItem('producto', JSON.stringify(this.producto));
      }
    });
  }
}