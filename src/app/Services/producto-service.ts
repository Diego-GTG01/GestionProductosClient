import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../Interfaces/producto';
import { Result } from '../Interfaces/result';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Departamento } from '../Interfaces/departamento';
import { DepartamentoService } from './departamento-service';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  apiUrl = environment.apiUrl + '/producto';
  opcionesDepartamento: Departamento[] = [];
  idUsuario: number = 0;

  constructor(
    private departamentoService: DepartamentoService,
    private http: HttpClient,
  ) {
    this.idUsuario = Number(sessionStorage.getItem('idUsuario')) ?? 0;
    this.departamentoService.getAll().subscribe({
      next: (result) => {
        if (result.correct) {
          this.opcionesDepartamento = result.objects;
        } else {
          console.error('algo salió mal');
        }
      },
      error: (err) => {
        console.warn(err);
      },
    });
  }

  getAll(): Observable<Result<Producto>> {
    return this.http.get<Result<Producto>>(this.apiUrl);
  }

  getById(): Observable<Result<Producto>> {
    return this.http.get<Result<Producto>>(this.apiUrl);
  }

  getByFolio(): Observable<Result<Producto>> {
    return this.http.get<Result<Producto>>(this.apiUrl);
  }
  getByClave(): Observable<Result<Producto>> {
    return this.http.get<Result<Producto>>(this.apiUrl);
  }
  add(producto: Producto, imagen: File): Observable<Result<Producto>> {
    const formData = new FormData();
    formData.append('producto', new Blob([JSON.stringify(producto)], { type: 'application/json' }));
    formData.append('imagen', imagen);

    return this.http.post<Result<Producto>>(this.apiUrl, formData);
  }
  update(producto: Producto): Observable<Result<Producto>> {
    return this.http.put<Result<Producto>>(this.apiUrl, producto);
  }
  updateImagen(producto: Producto, imagen: File): Observable<Result<Producto>> {
    const formData = new FormData();

    formData.append('producto', new Blob([JSON.stringify(producto)], { type: 'application/json' }));

    formData.append('imagen', imagen);

    return this.http.patch<Result<Producto>>(this.apiUrl, formData);
  }

  delete(idProducto: number, idUsuario: number): Observable<Result<Producto>> {
    return this.http.delete<Result<Producto>>(this.apiUrl + '?idProducto='+idProducto+'&idUsuario='+idUsuario);
  }

  editarProducto(producto: Producto): Promise<Producto | null> {
    return Swal.fire({
      title: 'Editar Producto',
      html: `
    <div class="container text-start">
      <div class="mb-3">
        <label class="form-label">
          Nombre
        </label>
        <input 
          id="nombre"
          class="form-control"
          placeholder="Nombre"
          value="${producto.nombre ?? ''}">
      </div>
      <div class="mb-3">
        <label class="form-label">
          Descripción
        </label>
        <textarea
          id="descripcion"
          class="form-control"
          rows="3"
          placeholder="Descripción">${producto.descripcion ?? ''}</textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">
          Precio
        </label>
        <input 
          id="precio"
          type="number"
          class="form-control"
          value="${producto.precio ?? 0}">
      </div>
      <div class="mb-3">
        <label class="form-label">
          Estado
        </label>
        <select 
          id="status"
          class="form-select">
          <option value="1" 
          ${producto.status == 1 ? 'selected' : ''}>
              Activo
          </option>
          <option value="0"
          ${producto.status == 0 ? 'selected' : ''}>
              Inactivo
          </option>
        </select>
      </div>
      
      <div class="mb-3">


        <label class="form-label">
          Departamento
        </label>

        <label class="form-label">Departamento</label>

  <select id="departamento" class="form-select">

    ${this.opcionesDepartamento
      .map(
        (dep) => `
          <option
            value="${dep.idDepartamento}"
            ${producto.departamento?.idDepartamento === dep.idDepartamento ? 'selected' : ''}>
            ${dep.nombre}
          </option>
        `,
      )
      .join('')}

  </select>


      </div>



    </div>

    `,

      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',

      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
        const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;
        const precio = Number((document.getElementById('precio') as HTMLInputElement).value);
        const status = Number((document.getElementById('status') as HTMLSelectElement).value);
        const departamento = {
          idDepartamento: (document.getElementById('departamento') as HTMLSelectElement).value,
        };
        const usuario = {
          idUsuario: this.idUsuario,
        };
        return {
          ...producto,

          nombre,
          descripcion,
          precio,
          status,
          departamento,
          usuario,
          fechaActualizacion: new Date(),
        };
      },
    }).then((result: any) => {
      if (result.isConfirmed) {
        return result.value;
      }
      return null;
    });
  }

  editarImagenProducto(producto: Producto): Promise<Producto | null> {
    producto.usuario.idUsuario = this.idUsuario;
    return Swal.fire({
      title: 'Editar imagen de Producto',
      html: `
      <div class="container text-start">
        <div class="mb-2">
          <p><strong>Producto:</strong> ${producto.nombre}</p>
        </div>
        <div class="mb-3">
          <label class="form-label" for="imagenInput">Selecciona la nueva imagen</label>
          <input 
            id="imagenInput"
            type="file" 
            class="form-control" 
            accept="image/*">
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar Imagen',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const input = document.getElementById('imagenInput') as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
          Swal.showValidationMessage('Por favor, selecciona un archivo de imagen');
          return false;
        }
        return input.files[0];
      },
    }).then((result: any) => {
      if (result.isConfirmed && result.value) {
        const imagenFile: File = result.value;
        Swal.showLoading();

        return new Promise<Producto | null>((resolve) => {
          this.updateImagen(producto, imagenFile).subscribe({
            next: (response) => {
              if (response.correct) {
                producto.imagen = response.object.imagen;

                Swal.fire('¡Éxito!', 'La imagen ha sido actualizada.', 'success');
                resolve(producto);
              } else {
                Swal.fire('Error', response.message || 'No se pudo actualizar la imagen', 'error');
                resolve(null);
              }
            },
            error: (err) => {
              Swal.fire('Error de red', 'No se pudo conectar con el servidor', 'error');
              console.error(err);
              resolve(null);
            },
          });
        });
      }
      return null;
    });
  }
}
