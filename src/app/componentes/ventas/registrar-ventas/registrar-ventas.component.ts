import { VentaServicioService } from './../../../servicios/ventas/venta-servicio.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente, CompraRequest, DatosVenta, MetodoPago, Producto, ProductoAddInt } from '../../../interfaces/venta/venta-back';
import { MessageService } from 'primeng/api';
import { ProductoViewModel, SimpleViewModel } from '../../../interfaces/inventario/inventario';

@Component({
  selector: 'app-registrar-ventas',
  templateUrl: './registrar-ventas.component.html',
  styleUrls: ['./registrar-ventas.component.css']
})
export class RegistrarVentasComponent implements OnInit {
  opcionesCantidadPago = Array.from({ length: 5 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
  compraForm!: FormGroup;
  productoForm!: FormGroup;
  productoDialogVisible: boolean = false;
  productosAdd: ProductoAddInt[] = [];

  productosDisponibles!: Producto[];
  clientes!: Cliente[];
  metodosPagos!: MetodoPago[]

  proveedores!: SimpleViewModel[];

  datosForm!: DatosVenta;
  constructor(private fb: FormBuilder,
    private servicio: VentaServicioService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.obtenerDatos();

    this.compraForm = this.fb.group({
      cliente: [null, Validators.required],
      productos: this.fb.array([]),
      metodosPago: this.fb.array([]) // 👈 asegurarse que sea plural y bien definido
    });


    this.crearProductoForm();
  }
  obtenerDatos() {
    this.servicio.obtenerDatos(1).subscribe({
      next: (data) => {
        this.datosForm = data;
        this.productosDisponibles = this.datosForm.productos;
        this.clientes = this.datosForm.clientes;
        this.metodosPagos = this.datosForm.metodosPago
      }
    })
  }
  get productos(): FormArray {
    return this.compraForm.get('productos') as FormArray;
  }

  crearProductoForm() {
    this.productoForm = this.fb.group({
      codigo: [null, Validators.required], // cambiará a contener el objeto producto
      descripcion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      descuento: [0, [Validators.min(0)]],
      iva: [{ value: 19, disabled: true }]
    });
  }

  abrirDialogoProducto() {
    this.productoForm.reset({ iva: 19, cantidad: 1, descuento: 0, precio: 0 });
    this.productoDialogVisible = true;
  }

  confirmarAgregarProducto() {
    if (this.productoForm.valid) {
      const productoSeleccionado = this.productoForm.get('codigo')?.value as Producto;
      const cantidad = this.productoForm.get('cantidad')?.value;

      const newProducto = this.fb.group({
        codigo: [productoSeleccionado.idProducto],
        descripcion: [productoSeleccionado.nombre],
        cantidad: [cantidad],
        precio: [productoSeleccionado.precio],
        descuento: [this.productoForm.get('descuento')?.value],
        iva: [19],
        total: [0]
      });

      this.calcularTotal(newProducto);
      this.productos.push(newProducto);
      this.productoDialogVisible = false;

      // ✅ Crear objeto InventarioGenerate y añadirlo al array
      const idProveedor = this.compraForm.get('cliente')?.value?.id;
      if (idProveedor) {
        const producto: ProductoAddInt = {
          idProducto: productoSeleccionado.idProducto,
          cantidad: cantidad
        }
        console.log(producto)
        this.productosAdd.push(producto);
      }

    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  productoSeleccionado(producto: ProductoViewModel) {
    this.productoForm.patchValue({
      descripcion: producto.nombre,
      precio: producto.precio
    });
  }

  calcularTotal(productoForm: FormGroup) {
    const cantidad = productoForm.get('cantidad')?.value || 0;
    const precio = productoForm.get('precio')?.value || 0;
    const iva = productoForm.get('iva')?.value || 0;
    const descuento = productoForm.get('descuento')?.value || 0;

    const subtotal = cantidad * precio;
    const totalConIva = subtotal + (subtotal * iva / 100);
    const totalFinal = totalConIva - (subtotal * descuento / 100);

    productoForm.get('total')?.setValue(totalFinal);
  }

  eliminarProducto(index: number) {
    const productoForm = this.productos.at(index);
    const idProducto = productoForm.get('codigo')?.value;

    this.productos.removeAt(index);

    // Eliminar también del array de inventario
    const idxInventario = this.productosAdd.findIndex(i => i.idProducto === idProducto);
    if (idxInventario !== -1) {
      this.productosAdd.splice(idxInventario, 1)
    }
  }


  enviando: boolean = false;

  guardarVenta() {
    const metodosPago = this.metodosPago.controls.map(metodo => ({
      idMetodoPago: metodo.get('tipo')?.value,
      valor: metodo.get('valor')?.value
    }));
    if (this.compraForm.invalid || this.productos.length === 0 || this.metodosPago.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Formulario incompleto', detail: 'Revisa los campos obligatorios' });
      this.compraForm.markAllAsTouched();
      return;
    }
    let totalRecaudado = 0;
    for(let item of metodosPago){
      totalRecaudado += item.valor;
    }
    if(totalRecaudado != this.totalGeneral){
      this.messageService.add({ severity: 'warn', summary: 'Valores incorrectos', detail: 'Revisa los valores que estas ingresando' });
      this.compraForm.markAllAsTouched();
      return;
    }
    this.enviando = true;

    const productos = this.productosAdd

    

    const compra: CompraRequest = {
      producto: productos,
      metodosPago: metodosPago,
      idPropietario: 1,
      idCliente: this.compraForm.get('cliente')?.value?.id,
      idUsuario: 1,
      idMetodoPago: 1,
      valorTotal: this.totalGeneral
    };

    this.servicio.registrarVenta(compra).subscribe({
      next: data => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: data.mensaje });
        this.compraForm.reset();
        this.productos.clear();
        this.metodosPago.clear();
        this.productosAdd = [];
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la compra' });
      },
      complete: () => {
        this.enviando = false;
      }
    }) 
  }




  get totalGeneral(): number {
    return this.productos.controls.reduce((acc, producto) => {
      return acc + (producto.get('total')?.value || 0);
    }, 0);
  }

  actualizarCantidadMetodosPago(cantidad: number) {
    const metodosArray = this.metodosPago;
    metodosArray.clear();

    for (let i = 0; i < cantidad; i++) {
      metodosArray.push(this.fb.group({
        tipo: [null, Validators.required], // el id del método de pago
        valor: [null, [Validators.required, Validators.min(0.01)]] // valor ingresado
      }));
    }
  }

  get metodosPago(): FormArray {
    return this.compraForm.get('metodosPago') as FormArray;
  }
  getMetodoFormGroup(index: number): FormGroup {
    return this.metodosPago.at(index) as FormGroup;
  }

}
