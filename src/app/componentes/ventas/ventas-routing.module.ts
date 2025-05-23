import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarVentasComponent } from './registrar-ventas/registrar-ventas.component';
import { ListadoVentasComponent } from './listado-ventas/listado-ventas.component';
import { FiltroVentasListadoComponent } from './filtro-ventas-listado/filtro-ventas-listado.component';
import { MenuComponent } from '../menu/menu.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {path: 'agregar-venta', component: RegistrarVentasComponent},
      {path: 'listado-venta-diario', component: ListadoVentasComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
