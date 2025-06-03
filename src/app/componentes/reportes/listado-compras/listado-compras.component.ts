import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';
import { ListadoFacturasPorMes } from '../../../interfaces/venta/venta-back';

@Component({
  selector: 'app-listado-compras',
  templateUrl: './listado-compras.component.html',
  styleUrl: './listado-compras.component.css'
})
export class ListadoComprasComponent {
  facturas: ListadoFacturasPorMes[] = [];
  mes: number = 0;
  year: number = 0;

  constructor(public config: DynamicDialogConfig,
    private servicio: VentaServicioService
  ) {}

  ngOnInit(): void {
    this.mes = this.config.data.mes;
    this.year = this.config.data.year;
    this.obtenerListadoMeses(1, this.mes, this.year)
  }
  obtenerListadoMeses(id: number, mes: number, year: number) {
    this.servicio.listadoComprasMes(year, mes).subscribe({
      next: (data) => {
        this.facturas = data;
      }
    })
  }
  get totalCompras(): number {
    return this.facturas?.reduce((acc, item) => acc + item.valor, 0) || 0;
  }
}
