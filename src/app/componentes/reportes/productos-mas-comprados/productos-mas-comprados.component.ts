import { Component } from '@angular/core';
import { ProductoMasVendidoDto } from '../../../interfaces/reportes/reporte-back';
import { ReportesService } from '../../../servicios/reportes/reportes.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-productos-mas-comprados',
  templateUrl: './productos-mas-comprados.component.html',
  styleUrl: './productos-mas-comprados.component.css'
})
export class ProductosMasCompradosComponent {
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
      this.productoService.getMarcas(1).subscribe(marcas => {
        this.marcas = marcas;
      });
    }
  
    obtenerProductos(): void {
      // Aquí llamas al servicio para obtener los productos con los filtros aplicados
      this.productoService.getProductosMasComprado(1).subscribe(data => {
        this.productos = data;
        this.actualizarGrafico();
      });
    }
  
    filtrarProductos(): void {
      // Vuelve a cargar los productos con los filtros seleccionados
      this.productoService.getProductosMasComprado(1, this.marcaSeleccionada!, this.fechaInicio!, this.fechaFin!).subscribe(data => {
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
