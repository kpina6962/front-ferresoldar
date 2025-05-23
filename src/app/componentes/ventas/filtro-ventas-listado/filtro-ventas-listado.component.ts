import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DetalleFactura } from '../../../interfaces/venta/venta-back';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';

@Component({
  selector: 'app-filtro-ventas-listado',
  templateUrl: './filtro-ventas-listado.component.html',
  styleUrl: './filtro-ventas-listado.component.css'
})
export class FiltroVentasListadoComponent implements OnInit{
  numFactura: number = 0;
  detallesFactura: DetalleFactura[] = [];

  constructor(public config: DynamicDialogConfig,
    private _ventaService: VentaServicioService
  ) { }

  ngOnInit(): void {
    this.numFactura = this.config.data.numFactura;
    this.buscarInformacion(this.numFactura, 1)
    // Aquí puedes hacer una petición al backend o buscar el detalle según numFactura
  }

  buscarInformacion(numFactura: number, idPropietario: number) {
    this._ventaService.obtenrInfoCompras(numFactura, idPropietario).subscribe({
      next: (data) => {
        this.detallesFactura = data;
      },
      error: (err) => {
        console.error('Error al obtener datos de ventas', err);
      }
    });
  }
}
