import { NgModule } from '@angular/core';
//A - materials
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatTreeModule} from '@angular/material/tree';
@NgModule({
  declarations: [

  ],
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTreeModule
  ],
  exports: [
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTreeModule
  ]
})
export class SharedModule { }
