import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../Services/producto-service';
import { Departamento } from '../../Interfaces/departamento';
import { RouterLink } from '@angular/router';
import { DepartamentoService } from '../../Services/departamento-service';

@Component({
  selector: 'app-vista-add-producto',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './vista-add-producto.html',
  styleUrl: './vista-add-producto.css',
})
export class VistaAddProducto implements OnInit {
  formularioRegistro: FormGroup;
  listaDepartamentos: Departamento[] = [];
  imagenSeleccionada: File | null = null;
  previsualizacionUrl: string | null = null;

  constructor(
    private departamentoService: DepartamentoService,
    private productoService: ProductoService,
  ) {
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
        idUsuario: new FormControl(1),
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
          console.log(this.listaDepartamentos);
        } else {
          console.log('No se pudo obtener Departamentos');
        }
      },
      error: (err) => {
        console.log(err);
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
      this.imagenSeleccionada = null;
      this.previsualizacionUrl = null;
    }
  }

  guardarProducto(): void {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    const producto = this.formularioRegistro.value;

    this.productoService.add(producto, this.imagenSeleccionada!).subscribe({
      next: (result) => {
        if (result.correct) {
          console.log('Producto agregado');
        } else {
          console.log(result.message);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
