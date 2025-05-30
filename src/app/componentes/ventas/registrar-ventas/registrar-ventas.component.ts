import { VentaServicioService } from './../../../servicios/ventas/venta-servicio.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente, CompraRequest, DatosVenta, MetodoPago, Producto, ProductoAddInt } from '../../../interfaces/venta/venta-back';
import { MessageService } from 'primeng/api';
import { SimpleViewModel } from '../../../interfaces/inventario/inventario';

@Component({
  selector: 'app-registrar-ventas',
  templateUrl: './registrar-ventas.component.html',
  styleUrls: ['./registrar-ventas.component.css']
})
export class RegistrarVentasComponent implements OnInit {
  opcionesCantidadPago = Array.from({ length: 5 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
  
  // Opciones de porcentaje de ganancia
  opcionesPorcentaje = [
    { label: '5%', value: 5 },
    { label: '10%', value: 10 },
    { label: '15%', value: 15 },
    { label: '20%', value: 20 },
    { label: '25%', value: 25 },
    { label: '30%', value: 30 },
    { label: '35%', value: 35 },
    { label: '40%', value: 40 },
    { label: '45%', value: 45 },
    { label: '50%', value: 50 }
  ];

  compraForm!: FormGroup;
  productoForm!: FormGroup;
  productoDialogVisible: boolean = false;
  productosAdd: ProductoAddInt[] = [];

  productosDisponibles!: Producto[];
  clientes!: Cliente[];
  metodosPagos!: MetodoPago[];

  proveedores!: SimpleViewModel[];

  datosForm!: DatosVenta;
  
  // Variables para ganancia
  gananciaPorcentaje: number = 0;
  valorGanancia: number = 0;

  constructor(private fb: FormBuilder,
    private servicio: VentaServicioService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.obtenerDatos();

    this.compraForm = this.fb.group({
      cliente: [null, Validators.required],
      productos: this.fb.array([]),
      metodosPago: this.fb.array([]),
      deseaGanancia: [false],
      porcentajeGanancia: [null]
    });

    this.crearProductoForm();
  }

  obtenerDatos() {
    this.servicio.obtenerDatos(1).subscribe({
      next: (data) => {
        this.datosForm = data;
        this.productosDisponibles = this.datosForm.productos;
        this.clientes = this.datosForm.clientes;
        this.metodosPagos = this.datosForm.metodosPago;
      }
    });
  }

  get productos(): FormArray {
    return this.compraForm.get('productos') as FormArray;
  }

  crearProductoForm() {
    this.productoForm = this.fb.group({
      codigo: [null, Validators.required],
      descripcion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      cantidadProducto: [{ value: 0, disabled: true }, [Validators.min(0)]],
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
    const cantidad = this.productoForm.get('cantidad')?.value;
    const cantidadProducto = this.productoForm.get('cantidadProducto')?.value;

    if (cantidad > cantidadProducto) {
      this.messageService.add({
        severity: 'info',
        summary: 'Cantidad excedida',
        detail: 'La cantidad ingresada supera la cantidad disponible.'
      });
      return;
    }

    if (this.productoForm.valid) {
      const productoSeleccionado = this.productoForm.get('codigo')?.value as Producto;
      const cantidad = this.productoForm.get('cantidad')?.value;

      const newProducto = this.fb.group({
        codigo: [productoSeleccionado.codigo],
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

      // Actualizar cálculos de ganancia
      this.calcularGanancia();

      const idProveedor = this.compraForm.get('cliente')?.value?.id;
      if (idProveedor) {
        const producto: ProductoAddInt = {
          idProducto: productoSeleccionado.idProducto,
          cantidad: cantidad
        };
        this.productosAdd.push(producto);
      }
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  productosFiltrados: Producto[] = [];

  filtrarProductos(event: any) {
    const query = event.query.toLowerCase();
    this.productosFiltrados = this.productosDisponibles.filter(producto =>
      `${producto.codigo} - ${producto.nombre}`.toLowerCase().includes(query)
    );
  }

  productoSeleccionado(producto: Producto) {
    this.productoForm.patchValue({
      descripcion: producto.nombre,
      precio: producto.precio,
      cantidadProducto: producto.cantidad
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
      this.productosAdd.splice(idxInventario, 1);
    }

    // Recalcular ganancia después de eliminar producto
    this.calcularGanancia();
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
    for (let item of metodosPago) {
      totalRecaudado += item.valor;
    }

    // Usar el total con ganancia para la validación
    if (totalRecaudado != this.totalConGanancia) {
      this.messageService.add({ severity: 'warn', summary: 'Valores incorrectos', detail: 'Revisa los valores que estas ingresando' });
      this.compraForm.markAllAsTouched();
      return;
    }

    this.enviando = true;

    const productos = this.productosAdd;

    const compra: CompraRequest = {
      producto: productos,
      metodosPago: metodosPago,
      idPropietario: 1,
      idCliente: this.compraForm.get('cliente')?.value?.id,
      idUsuario: 4,
      idMetodoPago: 1,
      valorTotal: this.totalConGanancia // Usar total con ganancia
    };

    this.servicio.registrarVenta(compra).subscribe({
      next: data => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: data.mensaje });
        this.resetearFormulario();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la compra' });
      },
      complete: () => {
        this.enviando = false;
      }
    });
  }

  resetearFormulario() {
    this.compraForm.reset();
    this.productos.clear();
    this.metodosPago.clear();
    this.productosAdd = [];
    this.gananciaPorcentaje = 0;
    this.valorGanancia = 0;
    
    // Resetear valores específicos
    this.compraForm.patchValue({
      deseaGanancia: false,
      porcentajeGanancia: null
    });
  }

  get totalGeneral(): number {
    return this.productos.controls.reduce((acc, producto) => {
      return acc + (producto.get('total')?.value || 0);
    }, 0);
  }

  get totalConGanancia(): number {
    return this.totalGeneral + this.valorGanancia;
  }

  actualizarCantidadMetodosPago(cantidad: number) {
    const metodosArray = this.metodosPago;
    metodosArray.clear();

    for (let i = 0; i < cantidad; i++) {
      metodosArray.push(this.fb.group({
        tipo: [null, Validators.required],
        valor: [null, [Validators.required, Validators.min(0.01)]]
      }));
    }
  }

  get metodosPago(): FormArray {
    return this.compraForm.get('metodosPago') as FormArray;
  }

  getMetodoFormGroup(index: number): FormGroup {
    return this.metodosPago.at(index) as FormGroup;
  }

  // Métodos para manejar la ganancia
  onGananciaChange(event: any) {
    if (!event.checked) {
      this.compraForm.get('porcentajeGanancia')?.setValue(null);
      this.gananciaPorcentaje = 0;
      this.valorGanancia = 0;
    }
  }

  onPorcentajeChange(porcentaje: number) {
    this.gananciaPorcentaje = porcentaje || 0;
    this.calcularGanancia();
  }

  calcularGanancia() {
    if (this.gananciaPorcentaje > 0) {
      this.valorGanancia = (this.totalGeneral * this.gananciaPorcentaje) / 100;
    } else {
      this.valorGanancia = 0;
    }
  }
}