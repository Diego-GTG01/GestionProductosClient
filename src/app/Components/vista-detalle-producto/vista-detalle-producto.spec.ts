import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaDetalleProducto } from './vista-detalle-producto';

describe('VistaDetalleProducto', () => {
  let component: VistaDetalleProducto;
  let fixture: ComponentFixture<VistaDetalleProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaDetalleProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaDetalleProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
