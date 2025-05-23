import { FiltroVentasListadoComponent } from './../filtro-ventas-listado/filtro-ventas-listado.component';
import { InformacionFacturasComponent } from './../informacion-facturas/informacion-facturas.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ListadoVenta } from '../../../interfaces/venta/venta-back';
import { Table } from 'primeng/table';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-listado-compras',
  templateUrl: './listado-compras.component.html',
  styleUrl: './listado-compras.component.css'
})
export class ListadoComprasComponent implements OnInit{
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
    this.obtenerListado(this.idPropietario)
  }

  obtenerListado(id: number) {
    this._serviciosVenta.obtenerListaCompras(id).subscribe({
      next: (data) => {
        this.facturas = data;
      }
    })
  }
  verFactura(numFactura: string) {
    let texto: string = (`🧾 Detalle de Factura N° ${numFactura}`);
    this._dialogservices.open(FiltroVentasListadoComponent, {
      header: texto,
      width: '70%',
      data: {
        numFactura: numFactura
      }
    });
  }
}
