import { Component, OnInit } from '@angular/core';
import { ResumenCierreCaja, MetodoPagoTotal } from '../../../interfaces/reportes/reporte-back';
import { ReportesService } from '../../../servicios/reportes/reportes.service';
import { Chart, ChartConfiguration } from 'chart.js';

export interface MetodoPagoGrafico {
  label: string;
  valor: number;
  porcentaje: number;
}


@Component({
  selector: 'app-cierres-de-caja',
  templateUrl: './cierres-de-caja.component.html',
  styleUrl: './cierres-de-caja.component.css'
})
export class CierresDeCajaComponent implements OnInit {
  fechaHoy = new Date();

  totalVentasDiario: MetodoPagoTotal[] = [];
  totalComprasDiario : MetodoPagoTotal[] = [];
  facturasVentas: any[] = [];
  facturasCompras: any[] = [];

  totalGlobalVendido: number = 0;
  totalGlobalComprado: number = 0;
  totalGeneral: number = 0;

  charts: Chart[] = [];

  porcentajeCompra: number = 0;
  porcentajeVenta: number = 0;

  graficosTotales: any[] = [];


  constructor(private reporteService: ReportesService) {

  }

  ngOnInit(): void {
    this.obtenerDatosCierreCaja();
  }


  obtenerDatosCierreCaja() {
    this.reporteService.obtenerCierreDeCajaDiario().subscribe({
      next: (data: ResumenCierreCaja) => {
        this.totalVentasDiario = data.totalVentasDiario;
        this.totalComprasDiario = data.totalComprasDiario;
        this.facturasVentas = data.facturasVentas;
        this.facturasCompras = data.facturasCompras;

        this.crearVariableGraficos(this.totalVentasDiario)
      },
      error: error => {
        console.error('Error al obtener el cierre de caja', error);
      }
    });
  }

  crearVariableGraficos(totalVentasDiario: MetodoPagoTotal[]) {
    const totalGeneralVentas = totalVentasDiario.reduce((acc, item) => acc + item.total, 0);
    const totalGeneralCompras = this.totalComprasDiario.reduce((acc, item) => acc + item.total, 0);
    this.totalGlobalVendido = this.totalVentasDiario
      .map(v => v.total)
      .reduce((acc, val) => acc + val, 0);

    this.totalGlobalComprado = this.totalComprasDiario
      .map(c => c.total)
      .reduce((acc, val) => acc + val, 0);
    this.totalGeneral = this.totalGlobalComprado + this.totalGlobalVendido;

    this.porcentajeVenta = (this.totalGlobalVendido / this.totalGeneral) * 100;

    console.log(this.totalGlobalVendido)
    console.log(this.totalGeneral)

    this.porcentajeCompra = (this.totalGlobalComprado / this.totalGeneral) * 100;
    this.graficosTotales = totalVentasDiario.map(item => {
      const porcentaje = totalGeneralVentas > 0 ? (item.total / totalGeneralVentas) * 100 : 0;

      return {
        label: item.metodoPago,  // Ajusta si el campo tiene otro nombre
        valor: item.total,
        porcentaje: parseFloat(porcentaje.toFixed(2))
      };
    });
    setTimeout(() => this.dibujarGraficos(), 0);
  }

  dibujarGraficos() {
  this.graficosTotales.forEach((g, i) => {
    const canvas = document.getElementById('chart-' + i) as HTMLCanvasElement;
    if (canvas) {
      new Chart(canvas, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [g.porcentaje, 100 - g.porcentaje],
            backgroundColor: ['#3F51B5', '#e0e0e0'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          rotation: -90,
          circumference: 180,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          }
        }
      });
    }
  });

  // Total Ventas
  const canvas2 = document.getElementById('chartTotalVentas') as HTMLCanvasElement;
  if (canvas2) {
    new Chart(canvas2, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.porcentajeVenta, 100 - this.porcentajeVenta],
          backgroundColor: ['#0984e3', '#E0E0E0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        rotation: -90,
        circumference: 180,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }

  // Total Compras
  const canvas3 = document.getElementById('chartTotalCompras') as HTMLCanvasElement;
  if (canvas3) {
    new Chart(canvas3, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.porcentajeCompra, 100 - this.porcentajeCompra],
          backgroundColor: ['#7c0000', '#E0E0E0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        rotation: -90,
        circumference: 180,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true }
        }
      }
    });
  }
}

}
