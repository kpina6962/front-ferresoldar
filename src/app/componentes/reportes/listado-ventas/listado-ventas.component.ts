import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ListadoVenta } from '../../../interfaces/venta/venta-back';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrl: './listado-ventas.component.css'
})
export class ListadoVentasComponent {
  facturas: ListadoVenta[] = [];
  mes: number = 0;
  year: number = 0;

  constructor(public config: DynamicDialogConfig,
    private servicio: VentaServicioService
  ) { }

  ngOnInit(): void {
    this.mes = this.config.data.mes;
    this.year = this.config.data.year;
    this.obtenerListadoMeses(1, this.mes, this.year)
  }
  obtenerListadoMeses(id: number, mes: number, year: number) {
    this.servicio.listadoVentasMes(id, year, mes).subscribe({
      next: (data) => {
        this.facturas = data;
      }
    })
  }
  get totalCompras(): number {
    return this.facturas?.reduce((acc, item) => acc + item.valor, 0) || 0;
  }
}
