import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../Services/producto-service';
import { Departamento } from '../../Interfaces/departamento';
import { RouterLink } from '@angular/router';
import { DepartamentoService } from '../../Services/departamento-service';
import { VistaUserBadge } from '../vista-user-badge/vista-user-badge';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-vista-add-producto',
  imports: [ReactiveFormsModule, RouterLink, VistaUserBadge],
  templateUrl: './vista-add-producto.html',
  styleUrl: './vista-add-producto.css',
})
export class VistaAddProducto implements OnInit {
  formularioRegistro: FormGroup;
  listaDepartamentos: Departamento[] = [];
  imagenSeleccionada: File | null = null;
  previsualizacionUrl: string | null = null;
  idUsuario: Number = 0;

  constructor(
    private departamentoService: DepartamentoService,
    private productoService: ProductoService,
  ) {
    this.idUsuario = Number(sessionStorage.getItem('idUsuario')) ?? 0;
    this.formularioRegistro = new FormGroup({
      clave: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      precio: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      status: new FormControl(1, [Validators.required]),
      departamento: new FormGroup({
        idDepartamento: new FormControl('', [Validators.required]),
      }),
      usuario: new FormGroup({
        idUsuario: new FormControl(this.idUsuario),
      }),
    });
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos(): void {
    this.departamentoService.getAll().subscribe({
      next: (result) => {
        if (result.correct) {
          this.listaDepartamentos = result.objects;
        } else {
          console.error('No se pudo obtener Departamentos');
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getControl(nombreControl: string): FormControl {
    return this.formularioRegistro.get(nombreControl) as FormControl;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previsualizacionUrl = reader.result as string;
      };
      reader.readAsDataURL(this.imagenSeleccionada);
    } else {
      this.limpiarImagen();
    }
  }

  limpiarImagen(): void {
    this.imagenSeleccionada = null;
    this.previsualizacionUrl = null;
  }

  guardarProducto(): void {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, llena todos los campos requeridos correctamente.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    Swal.fire({
      title: 'Guardando producto...',
      text: 'Por favor espera un momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const producto = this.formularioRegistro.value;

    this.productoService.add(producto, this.imagenSeleccionada!).subscribe({
      next: (result) => {
        if (result.correct) {
          Swal.fire({
            icon: 'success',
            title: '¡Producto Agregado!',
            text: 'El producto se registró correctamente en el catálogo.',
            timer: 2500,
            showConfirmButton: false,
          });

          this.limpiarFormulario();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: result.message || 'Ocurrió un problema en el servidor.',
            confirmButtonColor: '#d33',
          });
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo comunicar con el servidor. Inténtalo más tarde.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  limpiarFormulario(): void {
    this.formularioRegistro.reset({
      clave: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      status: 1,
      departamento: {
        idDepartamento: '',
      },
      usuario: {
        idUsuario: this.idUsuario,
      },
    });

    this.limpiarImagen();
  }
}
