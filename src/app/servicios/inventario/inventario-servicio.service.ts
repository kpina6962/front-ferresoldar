import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormProducto, InformacionProducto, Inventario, MovimientoInventarioRequest, ProductoAdd, ProductoViewModel, SimpleViewModel } from '../../interfaces/inventario/inventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioServicioService {
  private webApi: string = environment.endpoint;
  private api: string = 'api/Inventario/'
  private apiProducto: string = 'api/Producto/'
  private apiMov: string = 'api/MovimientoInventario/'
  private listadoProductos: string = 'listado-productos-compra'
  private listadoProveedores: string = 'listado-proveedores'
  private informacionProductos: string = 'informacion-producto'
  private datosProducto: string = 'datos-producto'
  private select: string = 'select-form'
  private agregarProducto: string = 'Agregar-Producto'
  private listadoInventario: string = 'listado-inventario'
  private metodosPago: string = 'metodos-pago-compras'

  constructor(private http: HttpClient) { }

  obtenerListadoInventario(idPropietario: number): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.webApi}${this.api}${this.listadoInventario}?idPropietario=${idPropietario}`);
  }
  obtenerMetodosPago(idPropietario: number): Observable<SimpleViewModel[]>{
    return this.http.get<SimpleViewModel[]>(`${this.webApi}${this.api}${this.metodosPago}?idPropietario=${idPropietario}`)
  }
  obtenerFormulario(idPropietario: number): Observable<FormProducto> {
    return this.http.get<FormProducto>(`${this.webApi}${this.apiProducto}${this.select}?idPropietario=${idPropietario}`);
  }
  obtenerProductos(idPropietario: number): Observable<ProductoViewModel[]> {
    return this.http.get<ProductoViewModel[]>(`${this.webApi}${this.api}${this.listadoProductos}?idPropietario=${idPropietario}`);
  }
  obtenerProveedores(idPropietario: number): Observable<SimpleViewModel[]> {
    return this.http.get<SimpleViewModel[]>(`${this.webApi}${this.api}${this.listadoProveedores}?idPropietario=${idPropietario}`);
  }
  enviarMovimientoInventario(payload: MovimientoInventarioRequest): Observable<any> {
    return this.http.post<any>(`${this.webApi}${this.apiMov}`, payload);
  }
  informacionProducto(idPropietario: number, idProducto: number): Observable<InformacionProducto> {
    return this.http.get<InformacionProducto>(`${this.webApi}${this.apiProducto}${this.informacionProductos}?idPropietario=${idPropietario}&idProducto=${idProducto}`)
  }
  datosProductoEditar(idPropietario: number, idProducto: number): Observable<ProductoAdd> {
    return this.http.get<ProductoAdd>(`${this.webApi}${this.apiProducto}${this.datosProducto}?idPropietario=${idPropietario}&idProducto=${idProducto}`)
  }

  editarProductoConAuditoria(idProducto: number, producto: any, cambios: any[]) {
    return this.http.put(`${this.webApi}${this.apiProducto}${idProducto}`, {
      producto,
      auditorias: cambios
    });
  }
  crearProducto(productoAdd: ProductoAdd, idPropietario: number): Observable<any> {
    const params = {
      idPropietario: idPropietario.toString(),
    };

    return this.http.post<any>(
      `${this.webApi}${this.apiProducto}${this.agregarProducto}`,
      productoAdd,
      { params }
    );
  }

}
