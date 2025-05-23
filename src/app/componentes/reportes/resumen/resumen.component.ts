import { ReportesService } from './../../../servicios/reportes/reportes.service';
import { Component, OnInit } from '@angular/core';
import { ReporteInventario } from '../../../interfaces/reportes/reporte-back';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css'
})
export class ResumenComponent implements OnInit{
  productos! : ReporteInventario[];

  constructor(private _servicio: ReportesService){}

  ngOnInit(): void {
    this.obtenerReporte(1);
  }

  obtenerReporte(id: number){
    this._servicio.obtenerReporteInventario(id).subscribe({
      next : (data) => {
        this.productos = data;
        this.crearGraficos();
      }
    })
  }
  get totalCantidad(): number {
    return this.productos.reduce((sum, p) => sum + p.cantidad, 0);
  }

  get totalCosto(): number {
    return this.productos.reduce((sum, p) => sum + (p.precioCompra), 0);
  }

  get totalVenta(): number {
    return this.productos.reduce((sum, p) => sum + (p.precioVenta), 0);
  }
  crearGraficos(): void {
    const labels = this.productos.map(p => p.nombre);
    const dataCompra = this.productos.map(p => p.precioCompra);
    const dataVenta = this.productos.map(p => p.precioVenta);
    const colores = this.generarColores(this.productos.length);

    // Destruye gráficos previos si existen
    Chart.getChart('chartCompra')?.destroy();
    Chart.getChart('chartVenta')?.destroy();

    new Chart('chartCompra', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataCompra,
          backgroundColor: colores,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });

  }

  generarColores(cantidad: number): string[] {
    const colores: string[] = [];
    for (let i = 0; i < cantidad; i++) {
      colores.push(`hsl(${(i * 360 / cantidad)}, 70%, 60%)`);
    }
    return colores;
  }
}
