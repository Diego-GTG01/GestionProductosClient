import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaUserBadge } from './vista-user-badge';

describe('VistaUserBadge', () => {
  let component: VistaUserBadge;
  let fixture: ComponentFixture<VistaUserBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaUserBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaUserBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
