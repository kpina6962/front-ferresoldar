import { Component, OnInit, ViewChild } from '@angular/core';
import { DetalleCompra } from '../../../interfaces/detalles/detalle-venta';
import { Table } from 'primeng/table';
import { ReportesService } from '../../../servicios/reportes/reportes.service';

@Component({
  selector: 'app-listado-compras',
  templateUrl: './listado-compras.component.html',
  styleUrl: './listado-compras.component.css'
})
export class ListadoComprasComponent implements OnInit {
  idPropietario: number = 1;
  datos!: DetalleCompra[];
  inventarioFiltrado: DetalleCompra[] = [];
  searchTerm: string = '';

  constructor(private reporteService: ReportesService) {
  }

  ngOnInit(): void {
    this.obtenerVentas(this.idPropietario);
  }

  obtenerVentas(id: number) {
    this.reporteService.obtenerDetallesCompras(id).subscribe({
      next: data => {
        this.datos = data
        this.filtrarInventario();
      }
    })
  }
  filtrarInventario() {
    const termino = this.searchTerm.toLowerCase();

    this.inventarioFiltrado = this.datos.filter(item =>
      item?.producto?.toLowerCase().includes(termino) ||
      item?.marca?.toLowerCase().includes(termino) ||
      item?.proveedor?.toLowerCase().includes(termino) ||
      item?.numFactura?.toString().toLowerCase().includes(termino)
    );
  }
}
