import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarVentasComponent } from './registrar-ventas/registrar-ventas.component';
import { ListadoVentasComponent } from './listado-ventas/listado-ventas.component';
import { FiltroVentasListadoComponent } from './filtro-ventas-listado/filtro-ventas-listado.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'agregar-venta', component: RegistrarVentasComponent},
      {path: 'listado-venta-diario', component: ListadoVentasComponent},
      {path: 'filtro-ventas', component: FiltroVentasListadoComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
