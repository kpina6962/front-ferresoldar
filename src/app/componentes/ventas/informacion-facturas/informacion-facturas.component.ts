import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DetalleFactura } from '../../../interfaces/venta/venta-back';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';


@Component({
  selector: 'app-informacion-facturas',
  templateUrl: './informacion-facturas.component.html',
  styleUrl: './informacion-facturas.component.css'
})
export class InformacionFacturasComponent implements OnInit {

  numFactura: number = 0;
  detallesFactura: DetalleFactura[] = [];

  constructor(public config: DynamicDialogConfig,
    private _ventaService: VentaServicioService
  ) { }

  ngOnInit(): void {
    this.numFactura = this.config.data.numFactura;
    this.buscarInformacion(this.numFactura)
    // Aquí puedes hacer una petición al backend o buscar el detalle según numFactura
  }

  buscarInformacion(numFactura: number) {
    this._ventaService.obtenrInfoVentas(numFactura).subscribe({
      next: (data) => {
        this.detallesFactura = data;
      },
      error: (err) => {
        console.error('Error al obtener datos de ventas', err);
      }
    });
  }
}
