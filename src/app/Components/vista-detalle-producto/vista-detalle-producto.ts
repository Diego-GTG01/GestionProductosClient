import { Component, OnInit } from '@angular/core';
import { Producto } from '../../Interfaces/producto';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { VistaUserBadge } from '../vista-user-badge/vista-user-badge';

@Component({
  selector: 'app-vista-detalle-producto',
  imports: [RouterLink, CurrencyPipe, DatePipe, VistaUserBadge],
  templateUrl: './vista-detalle-producto.html',
  styleUrl: './vista-detalle-producto.css',
})
export class VistaDetalleProducto implements OnInit {
  producto!: Producto;

  constructor(private router: Router) {}

  ngOnInit(): void {
    var producto = localStorage.getItem('producto');
    if (producto) {
      this.producto = JSON.parse(producto);
    } else {
      this.router.navigate(['/products']);
    }
  }
}
