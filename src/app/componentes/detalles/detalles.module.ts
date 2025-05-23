import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetallesRoutingModule } from './detalles-routing.module';
import { ListadoComprasComponent } from './listado-compras/listado-compras.component';
import { ListadoVentasComponent } from './listado-ventas/listado-ventas.component';
import { CardModule } from 'primeng/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListadoComprasComponent,
    ListadoVentasComponent
  ],
  imports: [
    CommonModule,
    DetallesRoutingModule,
    TableModule,
    CardModule,
    MatFormFieldModule,
    MatInputModule,
    InputTextModule,
    FormsModule
  ]
})
export class DetallesModule { }
