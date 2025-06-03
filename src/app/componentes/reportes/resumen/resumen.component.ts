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

  ngOnInit(): void {
    
  }

}
