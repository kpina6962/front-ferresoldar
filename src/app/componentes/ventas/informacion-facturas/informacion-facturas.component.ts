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

  numFactura: string = '';
  detallesFactura: DetalleFactura[] = [];

  constructor(public config: DynamicDialogConfig,
    private _ventaService: VentaServicioService
  ) { }

  ngOnInit(): void {
    this.numFactura = this.config.data.numFactura;
    this.buscarInformacion(this.numFactura, 1)
    // Aquí puedes hacer una petición al backend o buscar el detalle según numFactura
  }

  buscarInformacion(numFactura: string, idPropietario: number) {
    this._ventaService.obtenrInfoVentas(numFactura, idPropietario).subscribe({
      next: (data) => {
        this.detallesFactura = data;
      },
      error: (err) => {
        console.error('Error al obtener datos de ventas', err);
      }
    });
  }
}
