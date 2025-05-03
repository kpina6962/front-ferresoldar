import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoInventarioComponent } from './listado-inventario/listado-inventario.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'listado-inventario', component: ListadoInventarioComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
