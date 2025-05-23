import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioServicioService } from '../../../servicios/inventario/inventario-servicio.service';
import { Inventario } from '../../../interfaces/inventario/inventario';

@Component({
  selector: 'app-listado-inventario',
  templateUrl: './listado-inventario.component.html',
  styleUrl: './listado-inventario.component.css',
})
export class ListadoInventarioComponent implements OnInit {
  
  inventario!: Inventario[];
  inventarioFiltrado: Inventario[] = [];
  searchTerm: string = '';

  mostrarDialogoProducto: boolean = false;
  modoFormulario: 'crear' | 'editar' = 'crear';
  productoSeleccionado: Inventario | null = null;

  constructor(private fb: FormBuilder, private inventarioService: InventarioServicioService) {}

  ngOnInit(): void {
    let id = 1;
    this.obtenerListado(id);
  }
  
  obtenerListado(id: number) {
    this.inventarioService.obtenerListadoInventario(id).subscribe({
      next: data => {
        this.inventario = data;
        this.filtrarInventario();
      }
    })
  }
  filtrarInventario() {
    const termino = this.searchTerm.toLowerCase();
    this.inventarioFiltrado = this.inventario.filter(
      (item) =>
        item.nombre.toLowerCase().includes(termino) ||
        item.marca.toLowerCase().includes(termino) ||
        item.medida.toLowerCase().includes(termino)
    );
  }

  verProducto(producto: Inventario) {
    console.log('Ver producto:', producto);
  }

  abrirDialogoEditar(producto: Inventario) {
    this.modoFormulario = 'editar';
    this.productoSeleccionado = { ...producto };
    this.mostrarDialogoProducto = true;
  }

  crearProducto() {
    this.modoFormulario = 'crear';
    this.productoSeleccionado = null;
    this.mostrarDialogoProducto = true;
  }

  onProductoGuardado(producto: Inventario) {
    if (this.modoFormulario === 'crear') {
      this.inventario.push(producto);
    } else {
      const index = this.inventario.findIndex(p => p.id === producto.id);
      if (index > -1) {
        this.inventario[index] = producto;
      }
    }

    this.filtrarInventario();
    this.mostrarDialogoProducto = false;
  }
}
