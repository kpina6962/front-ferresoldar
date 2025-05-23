import { ReportesService } from './../../../servicios/reportes/reportes.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DetalleVenta } from '../../../interfaces/detalles/detalle-venta';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrl: './listado-ventas.component.css'
})
export class ListadoVentasComponent implements OnInit {
  idPropietario: number = 1;
  datos!: DetalleVenta[];
  inventarioFiltrado: DetalleVenta[] = [];
  searchTerm: string = '';


  constructor(private reporteService: ReportesService) {
  }

  ngOnInit(): void {
    this.obtenerVentas(this.idPropietario);
  }

  obtenerVentas(id: number) {
    this.reporteService.obtenerDetallesVenta(id).subscribe({
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
      item?.cliente?.toLowerCase().includes(termino) ||
      item?.numFactura?.toString().toLowerCase().includes(termino)
    );
  }

}
