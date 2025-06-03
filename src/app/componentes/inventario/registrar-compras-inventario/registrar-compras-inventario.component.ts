import { InventarioServicioService } from './../../../servicios/inventario/inventario-servicio.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioGenerate, ProductoViewModel, SimpleViewModel } from '../../../interfaces/inventario/inventario';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-registrar-compras-inventario',
  templateUrl: './registrar-compras-inventario.component.html',
  styleUrls: ['./registrar-compras-inventario.component.css']
})
export class RegistrarComprasInventarioComponent implements OnInit {
  compraForm!: FormGroup;
  productoForm!: FormGroup;
  productoDialogVisible: boolean = false;
  inventarioAGenerar: InventarioGenerate[] = [];

  proveedores!: SimpleViewModel[];
  metodosPago!: SimpleViewModel[];

  productosDisponibles!: ProductoViewModel[];

  constructor(private fb: FormBuilder,
    private servicio: InventarioServicioService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.obtenerProveedores();
    this.obtenerProductos();
    this.obtenerMetodosPago()
    this.compraForm = this.fb.group({
      proveedor: [null, Validators.required],
      quienSolicita: ['', Validators.required],
      quienAutoriza: [''],
      direccionEntrega: [''],
      observaciones: [''],
      metodoPago: [null, Validators.required],
      productos: this.fb.array([])
    });

    this.crearProductoForm();
  }

  obtenerProductos() {
    this.servicio.obtenerProductos().subscribe({
      next: data => {
        this.productosDisponibles = data;
      }
    })
  }
  obtenerProveedores() {
    this.servicio.obtenerProveedores().subscribe({
      next: data => {
        this.proveedores = data;
      }
    })
  }

  obtenerMetodosPago(){
    this.servicio.obtenerMetodosPago().subscribe({
      next: data => {
        this.metodosPago = data;
      }
    })
  }
  get productos(): FormArray {
    return this.compraForm.get('productos') as FormArray;
  }

  crearProductoForm() {
    this.productoForm = this.fb.group({
      codigo: [null, Validators.required], // cambiará a contener el objeto producto
      descripcion: [{ value: 0, disabled: true }, Validators.required],
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
      const productoSeleccionado = this.productoForm.get('codigo')?.value as ProductoViewModel;
      const cantidad = this.productoForm.get('cantidad')?.value;

      const newProducto = this.fb.group({
        codigo: [productoSeleccionado.codigo],
        descripcion: [productoSeleccionado.nombre],
        cantidad: [cantidad],
        precio: [productoSeleccionado.valor],
        descuento: [this.productoForm.get('descuento')?.value],
        iva: [19],
        total: [0]
      });

      this.calcularTotal(newProducto);
      this.productos.push(newProducto);
      this.productoDialogVisible = false;

      // ✅ Crear objeto InventarioGenerate y añadirlo al array
      const idProveedor = this.compraForm.get('proveedor')?.value?.id;
      if (idProveedor) {
        const inventario: InventarioGenerate = {
          idProducto: productoSeleccionado.id,
          cantidad: cantidad,
          idProveedor: idProveedor
        };
        this.inventarioAGenerar.push(inventario);
      }

    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  productoSeleccionado(producto: ProductoViewModel) {
    this.productoForm.patchValue({
      descripcion: producto.descripcion,
      precio: producto.valor
    });
  }

  productosFiltrados: ProductoViewModel[] = [];

  filtrarProductos(event: any) {
    const query = event.query.toLowerCase();
    this.productosFiltrados = this.productosDisponibles.filter(producto =>
      `${producto.codigo} - ${producto.nombre}`.toLowerCase().includes(query)
    );
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
    const idxInventario = this.inventarioAGenerar.findIndex(i => i.idProducto === idProducto);
    if (idxInventario !== -1) {
      this.inventarioAGenerar.splice(idxInventario, 1);
    }
  }


  enviando: boolean = false;

  guardarCompra() {
    if (this.enviando) return; // Evita múltiples envíos

    if (this.inventarioAGenerar.length != 0) {
      this.enviando = true;

      const idUsuario = 1;
      const idMetodoPago = this.compraForm.get('metodoPago')?.value?.id;
      const valor = this.totalGeneral;

      const payload = {
        inventarioAgregar: this.inventarioAGenerar,
        idUsuario,
        idMetodoPago,
        valor
      };

      this.servicio.enviarMovimientoInventario(payload).subscribe({
        next: res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: res.mensaje
          });
          this.compraForm.reset();
          this.productos.clear();
          this.inventarioAGenerar = [];
          this.enviando = false; // vuelve a habilitar
        },
        error: err => {
          console.error('Error al enviar inventario:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar el inventario'
          });
          this.enviando = false; // vuelve a habilitar
        }
      });
    } else {
      this.compraForm.markAllAsTouched();
    }
  }



  get totalGeneral(): number {
    return this.productos.controls.reduce((acc, producto) => {
      return acc + (producto.get('total')?.value || 0);
    }, 0);
  }

  imprimirCompra() {
    const compra = this.compraForm.getRawValue();

    let html = `
      <h2 style="text-align:center;">ORDEN DE COMPRA</h2>
      <table style="width:100%; margin-bottom: 1rem;">
        <tr>
          <td><b>FECHA:</b> ${new Date().toLocaleDateString()}</td>
          <td style="text-align:right;"><b>CONTACTO:</b> Kevin andres piña montaño</td>
        </tr>
        <tr>
          <td><b>PROVEEDOR:</b> ${compra.proveedor?.nombre || ''}</td>
          <td style="text-align:right;"><b>FECHA DE ENTREGA:</b> ${compra.direccionEntrega || ''}</td>
        </tr>
        <tr>
          <td><b>NIT:</b> 900456880</td>
          <td style="text-align:right;"><b>DIRECCIÓN DE ENTREGA:</b> ${compra.direccionEntrega || ''}</td>
        </tr>
        <tr>
          <td><b>DIRECCIÓN:</b> CARRERA 46 # 10 - 67</td>
          <td style="text-align:right;"><b>QUIEN SOLICITA:</b> ${compra.quienSolicita || ''}</td>
        </tr>
        <tr>
          <td><b>TELEFONO:</b> 4569080</td>
          <td style="text-align:right;"><b>QUIEN AUTORIZA:</b> ${compra.quienAutoriza || ''}</td>
        </tr>
        <tr>
          <td><b>CORREO:</b> servicios_prueba21@homecenter.com</td>
          <td></td>
        </tr>
      </table>

      <table border="1" cellspacing="0" cellpadding="5" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr style="background:#eee; font-weight:bold; text-align:center;">
            <th>CÓDIGO</th>
            <th>DESCRIPCIÓN</th>
            <th>CANTIDAD</th>
            <th>VALOR/U</th>
            <th>DESC %</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>`;

    compra.productos.forEach((p: any) => {
      html += `
        <tr>
          <td style="text-align:center;">${p.codigo}</td>
          <td>${p.descripcion}</td>
          <td style="text-align:center;">${p.cantidad}</td>
          <td style="text-align:right;">${p.precio.toLocaleString('es-CO')}</td>
          <td style="text-align:center;">${p.descuento}</td>
          <td style="text-align:right;">${p.total.toLocaleString('es-CO')}</td>
        </tr>`;
    });

    html += `
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" style="text-align:right; font-weight:bold;">TOTAL GENERAL:</td>
            <td style="text-align:right; font-weight:bold;">${this.totalGeneral.toLocaleString('es-CO')}</td>
          </tr>
        </tfoot>
      </table>`;

    const printWindow = window.open('', '', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Orden de Compra</title></head><body>');
      printWindow.document.write(html);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }
}