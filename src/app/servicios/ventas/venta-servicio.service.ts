import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraRequest, DatosVenta, DetalleFactura, ListadoCompra, ListadoVenta } from '../../interfaces/venta/venta-back';
import { ProductoVentaViewModel } from '../../interfaces/venta/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaServicioService {
  private webApi: string = environment.endpoint;
  private api: string = 'api/Venta';
  private datosCliente: string = '/formulario-venta';
  private listadoVenta: string = '/listado-ventas'
  private infoVenta: string = '/info-ventas';
  private infoCompra: string = '/info-compras';
  private listadoCompra: string = '/listado-compras'
  private listadoCompraMes: string = "/listado-compras-por-mes"
  private listadoVentaMes: string = "/listado-ventas-por-mes"
  constructor(private http: HttpClient) { }

  registrarVenta(compra: CompraRequest): Observable<any> {
    return this.http.post(`${this.webApi}${this.api}`, compra);
  }


  obtenerDatos(idPropietario: number): Observable<DatosVenta> {
    return this.http.get<DatosVenta>(`${this.webApi}${this.api}${this.datosCliente}?idPropietario=${idPropietario}`);
  }
  obtenrListaVentas(idPropietario: number): Observable<ListadoVenta[]> {
    return this.http.get<ListadoVenta[]>(`${this.webApi}${this.api}${this.listadoVenta}?idPropietario=${idPropietario}`);
  }
  obtenrInfoVentas(numFactura: string, idPropietario: number): Observable<DetalleFactura[]> {
    return this.http.get<DetalleFactura[]>(`${this.webApi}${this.api}${this.infoVenta}?idPropietario=${idPropietario}&numFactura=${numFactura}`);
  }
  obtenerListaCompras(idPropietario: number): Observable<ListadoCompra[]> {
    return this.http.get<ListadoCompra[]>(`${this.webApi}${this.api}${this.listadoCompra}?idPropietario=${idPropietario}`);
  }
  obtenrInfoCompras(numFactura: number, idPropietario: number): Observable<DetalleFactura[]> {
    return this.http.get<DetalleFactura[]>(`${this.webApi}${this.api}${this.infoCompra}?idPropietario=${idPropietario}&numFactura=${numFactura}`);
  }
  listadoComprasMes(idPropietario: number, year: number, mes: number): Observable<ListadoCompra[]> {
    return this.http.get<ListadoCompra[]>(`${this.webApi}${this.api}${this.listadoCompraMes}`, {
      params: {
        idPropietario: idPropietario,
        year: year,
        mes: mes
      }
    });
  }
  listadoVentasMes(idPropietario: number, year: number, mes: number): Observable<ListadoVenta[]> {
    return this.http.get<ListadoVenta[]>(`${this.webApi}${this.api}${this.listadoVentaMes}`, {
      params: {
        idPropietario: idPropietario,
        year: year,
        mes: mes
      }
    });
  }
}
