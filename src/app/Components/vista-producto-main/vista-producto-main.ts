import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../Services/producto-service';
import { Producto } from '../../Interfaces/producto';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-vista-producto-main',
  imports: [CurrencyPipe],
  templateUrl: './vista-producto-main.html',
  styleUrl: './vista-producto-main.css',
})
export class VistaProductoMain implements OnInit {
  constructor(
    private productoService: ProductoService,
    private router: Router,
  ) {}
  productos: Producto[] = [];
  ngOnInit(): void {
    
    localStorage.removeItem("producto");
    this.cargarProductos();
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
    localStorage.setItem("producto", JSON.stringify(producto));
    this.router.navigate(['/detail-product'])
  }
}
