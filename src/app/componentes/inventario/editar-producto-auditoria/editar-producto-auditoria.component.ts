import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventarioServicioService } from '../../../servicios/inventario/inventario-servicio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductoAdd, SimpleViewModel } from '../../../interfaces/inventario/inventario';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-editar-pproducto-auditoria',
  templateUrl: './editar-producto-auditoria.component.html',
  styleUrl: './editar-producto-auditoria.component.css'
})
export class EditarProductoAuditoriaComponent implements OnInit {
  formularioProducto!: FormGroup;
  producto!: ProductoAdd;

  medidas: SimpleViewModel[] = [];
  marcas: SimpleViewModel[] = [];
  secciones: SimpleViewModel[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditarProductoAuditoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idProducto: number },
    private servicio: InventarioServicioService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.obtenerInformacionProducto(this.data.idProducto)
    this.obtenerSelects(1);
  }

  inicializarFormulario() {
    this.formularioProducto = this.fb.group({
      nombre: [this.producto?.nombre || '', Validators.required],
      descripcion: [this.producto?.descripcion || '', Validators.required],
      idMedida: [this.producto?.idMedida || null, Validators.required],
      valor: [this.producto?.valor || null, [Validators.required, Validators.min(0)]],
      valorVenta: [this.producto?.valorVenta || null, [Validators.required, Validators.min(0)]],
      idMarca: [this.producto?.idMarca || null, Validators.required],
      idSeccion: [this.producto?.idSeccion || null, Validators.required],
    });
  }
  obtenerSelects(id: number) {
    this.servicio.obtenerFormulario(id).subscribe({
      next: (data) => {
        this.medidas = data.medida;
        this.marcas = data.marca;
        this.secciones = data.seccion;
      }
    })
  }
  obtenerInformacionProducto(id: number) {
    this.servicio.datosProductoEditar(1, id).subscribe({
      next: (data) => {
        this.producto = data;
        this.inicializarFormulario();
        console.log(data);
      }
    })
  }
  guardarProducto(): void {
    if (this.formularioProducto.valid) {
      const nuevoProducto = this.formularioProducto.value;
      const cambios: any[] = [];

      // Comparamos cada campo del formulario con el original
      for (const campo in nuevoProducto) {
        const valorOriginal = (this.producto as any)[campo];
        const valorNuevo = nuevoProducto[campo];

        if (valorOriginal !== valorNuevo) {
          cambios.push({
            campoModificado: campo,
            valorAnterior: valorOriginal?.toString() ?? '',
            valorNuevo: valorNuevo?.toString() ?? ''
          });
        }
      }

      if (cambios.length === 0) {
        this.messageService.add({ severity: 'info', summary: 'Sin cambios', detail: 'No se han detectado modificaciones.' });
        return;
      }

      // Confirmación antes de guardar
      this.confirmationService.confirm({
        message: '¿Está seguro de que desea editar este producto?',
        header: 'Confirmar edición',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => {
          this.servicio.editarProductoConAuditoria(this.data.idProducto, nuevoProducto, cambios).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado' });
              this.dialogRef.close(true);
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el producto' });
            }
          });
        }
      });

    }
  }

}
