import { Component, OnInit } from '@angular/core';
import { MetodoPagoData } from '../../../interfaces/reportes/reporte-back';
import { PrimeIcons } from 'primeng/api';
import { ReportesService } from '../../../servicios/reportes/reportes.service';

interface CustomMeterGroupItem {
  label: string;
  color1: string; // Primer color para el degradado o color de fondo
  color2: string; // Segundo color para el degradado
  value: number; // Será el porcentaje para la barra
  icon: string; // Icono de PrimeIcons
  // Puedes añadir más propiedades si las necesitas, como el totalValor original o cantidadTransacciones
  totalValorOriginal: number;
  cantidadTransaccionesOriginal: number;
}

@Component({
  selector: 'app-estados-de-cuenta',
  templateUrl: './estados-de-cuenta.component.html',
  styleUrl: './estados-de-cuenta.component.css'
})
export class EstadosDeCuentaComponent implements OnInit {
  backendData!: MetodoPagoData[];

  meterGroupDisplayValues: CustomMeterGroupItem[] = []; // Usaremos esta nueva estructura
  totalGeneral: number = 0; // Para calcular el total y los porcentajes

  constructor(private service: ReportesService){

  }

  ngOnInit(): void {
    this.obtenerEstadosCuenta();
  }

  obtenerEstadosCuenta(): void{
    this.service.obtenerEstadosDeCuenta(1).subscribe({
      next: (data) => {
        this.backendData = data;
        this.calculateDisplayValues();
      }
    })
  }

  calculateDisplayValues(): void {
    // 1. Calcular el total general de totalValor
    this.totalGeneral = this.backendData.reduce((sum, item) => sum + item.totalValor, 0);

    // 2. Mapear backendData a meterGroupDisplayValues
    this.meterGroupDisplayValues = this.backendData.map(item => {
      const percentage = this.totalGeneral > 0 ? (item.totalValor / this.totalGeneral) * 100 : 0;
      let color1: string = '';
      let color2: string = '';
      let icon: string = '';

      // Asigna colores e íconos basados en el método de pago
      switch (item.metodoPago) {
        case 'Efectivo':
          color1 = '#4CAF50'; // Verde
          color2 = '#81C784'; // Verde más claro
          icon = PrimeIcons.MONEY_BILL;
          break;
        case 'Credito':
          color1 = '#2196F3'; // Azul
          color2 = '#64B5F6'; // Azul más claro
          icon = PrimeIcons.CREDIT_CARD;
          break;
        case 'Transferencia':
          color1 = '#FFC107'; // Amarillo/Naranja
          color2 = '#FFD54F'; // Amarillo/Naranja más claro
          icon = PrimeIcons.WALLET; // O un ícono más específico si hay para Nequi
          break;
        default:
          color1 = '#9E9E9E'; // Gris
          color2 = '#BDBDBD'; // Gris más claro
          icon = PrimeIcons.QUESTION; // Ícono por defecto
          break;
      }

      return {
        label: item.metodoPago,
        color1: color1,
        color2: color2,
        value: parseFloat(percentage.toFixed(2)), // Redondea a 2 decimales
        icon: icon,
        totalValorOriginal: item.totalValor,
        cantidadTransaccionesOriginal: item.cantidadTransacciones
      };
    });
  }


}