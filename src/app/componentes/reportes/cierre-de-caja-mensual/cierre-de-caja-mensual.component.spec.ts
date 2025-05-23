import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreDeCajaMensualComponent } from './cierre-de-caja-mensual.component';

describe('CierreDeCajaMensualComponent', () => {
  let component: CierreDeCajaMensualComponent;
  let fixture: ComponentFixture<CierreDeCajaMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CierreDeCajaMensualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CierreDeCajaMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
