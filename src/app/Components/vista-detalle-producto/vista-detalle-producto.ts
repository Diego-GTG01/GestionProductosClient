import { Component, OnInit } from '@angular/core';
import { Producto } from '../../Interfaces/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-detalle-producto',
  imports: [],
  templateUrl: './vista-detalle-producto.html',
  styleUrl: './vista-detalle-producto.css',
})
export class VistaDetalleProducto implements OnInit {
  producto!: Producto;

  constructor(private router: Router){}

  ngOnInit(): void {
    var producto = localStorage.getItem("producto");
    if(producto){
      this.producto= JSON.parse(producto)
      
    }else{
      this.router.navigate(['/products'])
    }
  }
}
