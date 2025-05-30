import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoAdd, SimpleViewModel } from '../../../interfaces/inventario/inventario';
import { InventarioServicioService } from '../../../servicios/inventario/inventario-servicio.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-crear-editar-productos',
  templateUrl: './crear-editar-productos.component.html',
})
export class CrearEditarProductosComponent implements OnInit, OnChanges {
  PorcentajeGanancias = [
    { value: 5,  label: "5%" },
    { value: 10, label: "10%" },
    { value: 15, label: "15%"},
    { value: 20, label: "20%"},
    { value: 25, label: "25%"},
    { value: 30, label: "30%"},
    { value: 35, label: "35%"},
    { value: 40, label: "40%"},
    { value: 45, label: "45%"},
    { value: 50, label: "50%"},
    { value: 55, label: "55%"},
    { value: 60, label: "60%"},
    { value: 70, label: "70%"},
    { value: 80, label: "80%"},
    { value: 90, label: "90%"},
    { value: 100, label: "100%"},
  ]


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

  actualizarValorVenta() {
  const valor = this.formularioProducto.get('valor')?.value;
  const porcentaje = this.formularioProducto.get('porcentajeGanancia')?.value;

  if (valor != null && porcentaje != null) {
    const ganancia = valor * (porcentaje / 100);
    const valorVenta = valor + ganancia;
    this.formularioProducto.get('valorVenta')?.setValue(Math.round(valorVenta * 100) / 100, { emitEvent: false });
  }
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
      descripcion: [this.producto?.descripcion || '', Validators.required],
      idMedida: [this.producto?.idMedida || null, Validators.required],
      valor: [this.producto?.valor || null, [Validators.required, Validators.min(0)]],
      valorVenta: [this.producto?.valorVenta || null, [Validators.required, Validators.min(0)]],
      idMarca: [this.producto?.idMarca || null, Validators.required],
      idSeccion: [this.producto?.idSeccion || null, Validators.required],
      porcentajeGanancia: [null],
    });
  }

  formDataTexto: string = '';

  guardarProducto() {
    if (this.formularioProducto.valid) {
      const productoAdd: ProductoAdd = {
        nombre: this.formularioProducto.value.nombre,
        descripcion: this.formularioProducto.value.descripcion,
        idMedida: this.formularioProducto.value.idMedida,
        valor: this.formularioProducto.value.valor,
        valorVenta: this.formularioProducto.value.valorVenta,
        idMarca: this.formularioProducto.value.idMarca,
        idSeccion: this.formularioProducto.value.idSeccion,
      };

      if (this.modo === 'crear') {
        let productoNew: ProductoAdd = {
          idMarca: productoAdd.idMarca,
          idMedida: productoAdd.idMedida,
          idSeccion: productoAdd.idSeccion,
          nombre: productoAdd.nombre,
          descripcion: productoAdd.descripcion,
          valor: productoAdd.valor,
          valorVenta: productoAdd.valorVenta
        }
        this.crearProducto(productoNew, this.idPropietario)
      } else if (this.modo === 'editar') {
        console.log('Modo EDITAR. Producto:', productoAdd);
      }

    } else {
      this.formularioProducto.markAllAsTouched();
    }
  }

  crearProducto(producto: ProductoAdd, idPropietario: number) {
    this.servicio.crearProducto(producto, idPropietario).subscribe({
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
