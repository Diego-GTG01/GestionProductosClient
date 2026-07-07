import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaProductoMain } from './vista-producto-main';

describe('VistaProductoMain', () => {
  let component: VistaProductoMain;
  let fixture: ComponentFixture<VistaProductoMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaProductoMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaProductoMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
