import { ListadoVenta } from './../../../interfaces/venta/venta-back';
import { Component, OnInit } from '@angular/core';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';
import { ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InformacionFacturasComponent } from '../informacion-facturas/informacion-facturas.component';
@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrl: './listado-ventas.component.css'
})
export class ListadoVentasComponent implements OnInit {
  facturas: ListadoVenta[] = [];
  idPropietario: number = 1;
  @ViewChild('dt') dt!: Table;

  constructor(
    private _serviciosVenta: VentaServicioService,
    private _dialogservices: DialogService
  ) {

  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }

  ngOnInit(): void {
    this.obtenerListado()
  }

  obtenerListado() {
    this._serviciosVenta.obtenrListaVentas().subscribe({
      next: (data) => {
        this.facturas = data;
      }
    })
  }
  verFactura(numFactura: string) {
    let texto: string = (`🧾 Detalle de Factura N° ${numFactura}`);
    this._dialogservices.open(InformacionFacturasComponent, {
      header: texto,
      width: '70%',
      data: {
        numFactura: numFactura
      }
    });
  }
}
