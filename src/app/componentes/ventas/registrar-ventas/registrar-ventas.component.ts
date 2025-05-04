import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoVentaViewModel, VentaViewModel, DatosViewModel } from '../../../interfaces/venta';

@Component({
  selector: 'app-registrar-ventas',
  templateUrl: './registrar-ventas.component.html',
  styleUrls: ['./registrar-ventas.component.css']
})
export class RegistrarVentasComponent implements OnInit {
  ventaForm: FormGroup;

  productos = [
    { id: 1, nombre: 'Producto 1' },
    { id: 2, nombre: 'Producto 2' },
    { id: 3, nombre: 'Producto 3' },
  ];

  clientes = [
    { id: 1, nombre: 'Cliente 1' },
    { id: 2, nombre: 'Cliente 2' },
  ];

  metodosPago = [
    { id: 1, nombre: 'Tarjeta de Crédito' },
    { id: 2, nombre: 'Efectivo' },
  ];
  

  // Listado de productos agregados
  productosVenta: ProductoVentaViewModel[] = [];

  // Datos generales de la venta
  datosVenta: DatosViewModel = {
    IdPropietario: 1,  // Ejemplo: debería venir del login o selección
    IdCliente: 0,
    IdUsuario: 1,
    IdMetodoPago: 0
  };

  constructor(private fb: FormBuilder) {
    this.ventaForm = this.fb.group({
      producto: [null, Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      cliente: [null, Validators.required],
      metodoPago: [null, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.ventaForm.valid) {
      const { producto, cantidad, cliente, metodoPago } = this.ventaForm.value;

      // Actualizamos los datos generales de la venta
      this.datosVenta.IdCliente = cliente;
      this.datosVenta.IdMetodoPago = metodoPago;

      // Agregamos el producto a la lista
      const nuevoProducto: ProductoVentaViewModel = {
        IdProducto: producto,
        Cantidad: cantidad
      };
      console.log(nuevoProducto)
      this.productosVenta.push(nuevoProducto);

      // Limpiar solo campos de producto/cantidad
      this.ventaForm.patchValue({ producto: null, cantidad: null });
    }
  }

  eliminarProducto(producto: ProductoVentaViewModel): void {
    const index = this.productosVenta.indexOf(producto);
    if (index > -1) {
      this.productosVenta.splice(index, 1);
    }
  }

  getVentaCompleta(): VentaViewModel {
    return {
      ...this.datosVenta,
      producto: this.productosVenta
    };
  }
  imprimirVenta(): void {
    const venta = this.getVentaCompleta();
    console.log('Información de la venta:', venta);
  }
}
