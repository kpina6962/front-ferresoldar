import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InformacionProducto } from '../../../interfaces/inventario/inventario';
import { InventarioServicioService } from '../../../servicios/inventario/inventario-servicio.service';

@Component({
  selector: 'app-informacion-producto',
  templateUrl: './informacion-producto.component.html',
  styleUrl: './informacion-producto.component.css'
})
export class InformacionProductoComponent {
  producto!: InformacionProducto;

  constructor(
    public dialogRef: MatDialogRef<InformacionProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idProducto: number },
    private servicio: InventarioServicioService
  ) {}

  ngOnInit(): void {
    this.cargarProducto(this.data.idProducto);
  }

  cargarProducto(id: number) {
    this.servicio.informacionProducto(id).subscribe({
      next : data => {
        this.producto = data;
      }
    })
  }
}
