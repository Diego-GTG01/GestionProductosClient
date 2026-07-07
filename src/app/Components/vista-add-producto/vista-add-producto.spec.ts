import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAddProducto } from './vista-add-producto';

describe('VistaAddProducto', () => {
  let component: VistaAddProducto;
  let fixture: ComponentFixture<VistaAddProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaAddProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaAddProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
