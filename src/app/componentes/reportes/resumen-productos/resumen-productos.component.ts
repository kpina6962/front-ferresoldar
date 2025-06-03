import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../../servicios/reportes/reportes.service';
import { ProductoMasVendidoDto } from '../../../interfaces/reportes/reporte-back';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-resumen-productos',
  templateUrl: './resumen-productos.component.html',
  styleUrls: ['./resumen-productos.component.css']
})
export class ResumenProductosComponent implements OnInit {
  productos: ProductoMasVendidoDto[] = [];
  marcas: { id: number, nombre: string }[] = []; // Lista de marcas
  selectedMarca: number | null = null; // Marca seleccionada
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  marcaSeleccionada: number | null = null;

  constructor(private productoService: ReportesService) { }

  ngOnInit(): void {
    this.obtenerMarcas();
    this.obtenerProductos(); // Cargar productos inicialmente sin filtros
  }

  obtenerMarcas(): void {
    // Aquí debes obtener las marcas desde tu servicio o fuente de datos
    this.productoService.getMarcas().subscribe(marcas => {
      this.marcas = marcas;
    });
  }

  obtenerProductos(): void {
    // Aquí llamas al servicio para obtener los productos con los filtros aplicados
    this.productoService.getProductosMasVendidos().subscribe(data => {
      this.productos = data;
      this.actualizarGrafico();
    });
  }

  filtrarProductos(): void {
    // Vuelve a cargar los productos con los filtros seleccionados
    this.productoService.getProductosMasVendidos(this.marcaSeleccionada!, this.fechaInicio!, this.fechaFin!).subscribe(data => {
      this.productos = data;
      this.actualizarGrafico();
    });
  }
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: '#495057' },
        grid: { color: '#ebedef' }
      },
      y: {
        ticks: { color: '#495057' },
        grid: { color: '#ebedef' },
        beginAtZero: true
      }
    }
  };
  grafico!: ChartData<'bar'>;
  actualizarGrafico(): void {
    const etiquetas = this.productos.map(r => r.nombre);
    const compras = this.productos.map(r => r.totalVenta);
    this.grafico = {
      labels: etiquetas,
      datasets: [
        {
          label: 'Compras',
          data: compras,
          backgroundColor: '#42A5F5'
        },
      ]
    };
  }
}
