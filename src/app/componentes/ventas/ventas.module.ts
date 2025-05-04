import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { FiltroVentasListadoComponent } from './filtro-ventas-listado/filtro-ventas-listado.component';
import { ListadoVentasComponent } from './listado-ventas/listado-ventas.component';
import { RegistrarVentasComponent } from './registrar-ventas/registrar-ventas.component';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
// Angular Forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// PrimeNG Modules
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    FiltroVentasListadoComponent,
    ListadoVentasComponent,
    RegistrarVentasComponent
  ],
  imports: [
    MatCardModule,
    CommonModule,
    VentasRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class VentasModule {}
