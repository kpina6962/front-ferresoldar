import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from './reportes/reportes.component';
import { MenuComponent } from '../menu/menu.component';
import { ResumenComponent } from './resumen/resumen.component';
import { CierresDeCajaComponent } from './cierres-de-caja/cierres-de-caja.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {path: 'reportes', component: ReportesComponent},
      {path: 'resumen', component: ResumenComponent},
      {path: 'cierre-de-caja-diario', component: CierresDeCajaComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
