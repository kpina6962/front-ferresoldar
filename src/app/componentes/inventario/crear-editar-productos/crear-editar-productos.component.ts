import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoAdd, ProductoBack, SimpleViewModel } from '../../../interfaces/inventario/inventario';
import { InventarioServicioService } from '../../../servicios/inventario/inventario-servicio.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-crear-editar-productos',
  templateUrl: './crear-editar-productos.component.html',
})
export class CrearEditarProductosComponent implements OnInit, OnChanges {
  idPropietario = 1;
  @Input() visible: boolean = false;
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() producto: any = null;
  @Output() productoGuardado = new EventEmitter<any>();
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() dialogStyle: any;
  @Input() dialogStyleClass: string = '';

  formularioProducto!: FormGroup;

  medidas: SimpleViewModel[] = [];
  marcas: SimpleViewModel[] = [];
  secciones: SimpleViewModel[] = [];

  constructor(private fb: FormBuilder,
    private servicio: InventarioServicioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerSelects(this.idPropietario)
    this.inicializarFormulario();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['producto'] && this.formularioProducto) {
      this.inicializarFormulario();
    }
  }

  inicializarFormulario() {
    this.formularioProducto = this.fb.group({
      nombre: [this.producto?.nombre || '', Validators.required],
      idMedida: [this.producto?.idMedida || null, Validators.required],
      valor: [this.producto?.valor || null, [Validators.required, Validators.min(0)]],
      valorVenta: [this.producto?.valorVenta || null, [Validators.required, Validators.min(0)]],
      idMarca: [this.producto?.idMarca || null, Validators.required],
      idSeccion: [this.producto?.idSeccion || null, Validators.required],
    });
  }

  formDataTexto: string = '';

  guardarProducto() {
    if (this.formularioProducto.valid) {
      const productoAdd: ProductoAdd = {
        nombre: this.formularioProducto.value.nombre,
        idMedida: this.formularioProducto.value.idMedida,
        valor: this.formularioProducto.value.valor,
        precioVenta: this.formularioProducto.value.valorVenta,
        idMarca: this.formularioProducto.value.idMarca,
        idSeccion: this.formularioProducto.value.idSeccion,
      };

      if (this.modo === 'crear') {
        let productoNew: ProductoBack = {
          idMarca: productoAdd.idMarca,
          idMedida: productoAdd.idMedida,
          idSeccion: productoAdd.idSeccion,
          nombre: productoAdd.nombre,
          valor: productoAdd.valor
        }
        this.crearProducto(productoNew, productoAdd.precioVenta, this.idPropietario)
      } else if (this.modo === 'editar') {
        console.log('Modo EDITAR. Producto:', productoAdd);
      }

    } else {
      this.formularioProducto.markAllAsTouched();
    }
  }

  crearProducto(producto: ProductoBack, precioVenta: number, idPropietario: number) {
    this.servicio.crearProducto(producto, idPropietario, precioVenta).subscribe({
      next: data => {
        console.log(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto agregado correctamente'
        });
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el producto'
        });
      }
    });
  }


  cerrarDialogo() {
    this.visibleChange.emit(false);
  }
}
