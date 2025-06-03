import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import { ReporteBack, ReporteMensual, ReporteSemanal } from '../../../interfaces/reportes/reporte-back';
import { ReportesService } from '../../../servicios/reportes/reportes.service';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-reporte',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  form: FormGroup;
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  data!: ReporteBack;
  reporteMensual!: ReporteMensual[];
  reporteSemanal!: ReporteSemanal[];
  yearSelected: Date = new Date();

  yearDefault: number = new Date().getFullYear();
  mesDefault: number = new Date().getMonth() + 1; // +1 porque getMonth() devuelve 0-11


  chartData!: ChartData<'bar'>;
  chartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true, // Puedes cambiar a false si no quieres mostrar leyenda
      position: 'top'
    }
  },
  scales: {
    x: {
      stacked: true,
      ticks: { color: '#495057' },
      grid: { color: '#ebedef' }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        color: '#495057',
        callback: function (value) {
          return value.toLocaleString();
        }
      },
      grid: { color: '#ebedef' }
    }
  }
};


  constructor(private _service: ReportesService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      start: [null],
      end: [null]
    });
  }

  ngOnInit(): void {
    this.obtenerDatos();
  }
  obtenerDatos() {
    this._service.obtenerReporte().subscribe({
      next: (d) => {
        this.data = d
        this.actualizarGrafico();
      }
    })
    this._service.obtenerReporteMensual(this.yearDefault).subscribe({
      next: (data) => {
        this.reporteMensual = data;
        this.actualizarGraficoMensual();
      }
    })
    this._service.obtenerReporteSemanal(this.yearDefault, this.mesDefault).subscribe({
      next: (de) => {
        this.reporteSemanal = de;
        this.actualizarGraficoSemanal();
      }
    })
  }
  actualizarGrafico(): void {
    this.chartData = {
      labels: ['Compras', 'Ventas', 'Ganancias'],
      datasets: [
        {
          label: 'Resumen',
          data: [this.data.compras, this.data.venta, this.data.ganancia],
          backgroundColor: ['#5d6b7f', '#cbd5e1', '#66BB6A']
        }
      ]
    };
  }
  graficoMensualData!: ChartData<'bar'>;

  actualizarGraficoMensual(): void {
  const etiquetas = this.reporteMensual.map(r => r.mes);
  const compras = this.reporteMensual.map(r => r.compras);
  const ventas = this.reporteMensual.map(r => r.venta);

  this.graficoMensualData = {
    labels: etiquetas,
    datasets: [
      {
        label: 'Compras',
        data: compras,
        backgroundColor: '#5d6b7f'
      },
      {
        label: 'Ventas',
        data: ventas,
        backgroundColor: '#cbd5e1'
      }
    ]
  };
}

  graficoSemanalData!: ChartData<'bar'>;
  actualizarGraficoSemanal(): void {
    const etiquetas = this.reporteSemanal.map(r => r.semana);
    const compras = this.reporteSemanal.map(r => r.compras);
    const ventas = this.reporteSemanal.map(r => r.venta);
    this.graficoSemanalData = {
      labels: etiquetas,
      datasets: [
        {
          label: 'Compras',
          data: compras,
          backgroundColor: '#5d6b7f'
        },
        {
          label: 'Ventas',
          data: ventas,
          backgroundColor: '#cbd5e1'
        },
      ]
    };
  }

  selectedDate: Date = new Date();

  chosenYearHandler(normalizedYear: Date) {
    const ctrlValue = this.selectedDate;
    ctrlValue.setFullYear(normalizedYear.getFullYear());
    this.selectedDate = new Date(ctrlValue); // actualizar valor sin cambiar mes
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<any>) {
    const ctrlValue = this.selectedDate;
    ctrlValue.setMonth(normalizedMonth.getMonth());
    this.selectedDate = new Date(ctrlValue);

    datepicker.close();

    this.onMonthYearChange(this.selectedDate);
  }

  onMonthYearChange(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // enero = 0, por eso +1
    this.mesDefault = month;
    this.yearDefault = year;

    this._service.obtenerReporteMensual(year).subscribe({
      next: (data) => {
        this.reporteMensual = data;
        this.actualizarGraficoMensual();
      }
    })
    this._service.obtenerReporteSemanal(year, month).subscribe({
      next: (de) => {
        this.reporteSemanal = de;
        this.actualizarGraficoSemanal();
      }
    })
  }

}
