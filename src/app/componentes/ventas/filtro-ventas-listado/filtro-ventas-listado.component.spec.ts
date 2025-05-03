import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroVentasListadoComponent } from './filtro-ventas-listado.component';

describe('FiltroVentasListadoComponent', () => {
  let component: FiltroVentasListadoComponent;
  let fixture: ComponentFixture<FiltroVentasListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroVentasListadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltroVentasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
