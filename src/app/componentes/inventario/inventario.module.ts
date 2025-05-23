import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListadoInventarioComponent } from './listado-inventario/listado-inventario.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearEditarProductosComponent } from './crear-editar-productos/crear-editar-productos.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RegistrarComprasInventarioComponent } from './registrar-compras-inventario/registrar-compras-inventario.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [
    ListadoInventarioComponent,
    CrearEditarProductosComponent,
    RegistrarComprasInventarioComponent
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    TableModule,
    CardModule,
    MatFormFieldModule,
    MatInputModule,
    DynamicDialogModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    MessageModule,
    MessagesModule
  ],
  providers: [
      DialogService,
      MessageService
  ]
})
export class InventarioModule { }
