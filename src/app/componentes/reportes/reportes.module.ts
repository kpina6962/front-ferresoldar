import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes/reportes.component';
//Prime ng
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ResumenComponent } from './resumen/resumen.component';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { ResumenProductosComponent } from './resumen-productos/resumen-productos.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CierresDeCajaComponent } from './cierres-de-caja/cierres-de-caja.component';
import { ProductosMasCompradosComponent } from "./productos-mas-comprados/productos-mas-comprados.component";

@NgModule({
  declarations: [
    ReportesComponent,
    ResumenComponent,
    ResumenProductosComponent,
    CierresDeCajaComponent,
    ProductosMasCompradosComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    ChartModule,
    CardModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    MatCardModule,
    TableModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }
  ]
})
export class ReportesModule { }
