import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes : Routes = [
  {
    path: 'inventario',
    loadChildren: () => import('./componentes/inventario/inventario.module').then(m => m.InventarioModule)
  },
  {
    path: 'ventas',
    loadChildren: () => import('./componentes/ventas/ventas.module').then(m => m.VentasModule)
  },
  {
    path: '**', redirectTo: 'ventas/agregar-venta'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
