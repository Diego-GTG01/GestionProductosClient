import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaLogin } from './vista-login';

describe('VistaLogin', () => {
  let component: VistaLogin;
  let fixture: ComponentFixture<VistaLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
