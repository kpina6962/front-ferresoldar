import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { ListadoVentasComponent } from './listado-ventas/listado-ventas.component';
import { ListadoComprasComponent } from './listado-compras/listado-compras.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {path: 'listado-ventas', component: ListadoVentasComponent},
      {path: 'listado-compras', component: ListadoComprasComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetallesRoutingModule { }
