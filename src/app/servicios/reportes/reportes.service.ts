import { ProductoMasVendidoDto, ReporteInventario, ReporteSemanal, ResumenCierreCaja } from './../../interfaces/reportes/reporte-back';
import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteBack, ReporteMensual } from '../../interfaces/reportes/reporte-back';
import { DetalleCompra, DetalleVenta } from '../../interfaces/detalles/detalle-venta';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private webApi: string = environment.endpoint;
  private api: string = 'api/Reportes/'
  //
  private reportes: string = 'reporte'
  private reporteMensual: string = 'reporte-meses'
  private ReporteSemanalu: string = 'reporte-semanal'
  //
  private ReporteInventariou: string = 'reporte-inventario'
  private ReporteProductos: string = 'reporte-productos'
  private ReporteProductosComprados: string = 'reporte-productos-comprados'
  private ObtenerMarca: string = 'api/Producto/obtener-marca'
  //
  private DetalleVentas: string = 'detalle-ventas'
  private DetalleCompras: string = 'detalle-compras'
  
  private CierreCaja: string = 'cierre-de-caja-diario'
  constructor(private http: HttpClient) { }
  //Estadisticas
  obtenerReporte(idPropietario: number):Observable<ReporteBack> {
    let params = new HttpParams().set('idPropietario', idPropietario);

    return this.http.get<ReporteBack>(`${this.webApi}${this.api}${this.reportes}`, { params });
  }
  obtenerReporteMensual(idPropietario: number, year: number):Observable<ReporteMensual[]>{
    return this.http.get<ReporteMensual[]>(`${this.webApi}${this.api}${this.reporteMensual}?idPropietario=${idPropietario}&year=${year}`)
  }
  obtenerReporteSemanal(idPropietario: number, year: number, mes: number):Observable<ReporteSemanal[]>{
    return this.http.get<ReporteSemanal[]>(`${this.webApi}${this.api}${this.ReporteSemanalu}?idPropietario=${idPropietario}&year=${year}&mes=${mes}`)
  }
  //Resumen
  obtenerReporteInventario(idPropietario: number):Observable<ReporteInventario[]>{
    return this.http.get<ReporteInventario[]>(`${this.webApi}${this.api}${this.ReporteInventariou}?idPropietario=${idPropietario}`)
  }
  getMarcas(idPropietario: number): Observable<{ id: number, nombre: string }[]> {
    return this.http.get<{ id: number, nombre: string }[]>(`${this.webApi}${this.ObtenerMarca}?idPropietario=${idPropietario}`); // Ajusta la URL a tu API
  }

  getProductosMasVendidos(idPropietario:number, idMarca?: number, fechaInicio?: Date, fechaFin?: Date): Observable<ProductoMasVendidoDto[]> {
    let params = new HttpParams().set('idPropietario', idPropietario);
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio.toISOString());
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin.toISOString());
    }

    if(idMarca){
      params = params.set('idMarca', idMarca)
    }
    return this.http.get<ProductoMasVendidoDto[]>(`${this.webApi}${this.api}${this.ReporteProductos}`, { params });
  }
  getProductosMasComprado(idPropietario:number, idMarca?: number, fechaInicio?: Date, fechaFin?: Date): Observable<ProductoMasVendidoDto[]> {
    let params = new HttpParams().set('idPropietario', idPropietario);
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio.toISOString());
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin.toISOString());
    }

    if(idMarca){
      params = params.set('idMarca', idMarca)
    }
    return this.http.get<ProductoMasVendidoDto[]>(`${this.webApi}${this.api}${this.ReporteProductosComprados}`, { params });
  }
  //Listados info
  obtenerDetallesVenta(idPropietario: number):Observable<DetalleVenta[]>{
    return this.http.get<DetalleVenta[]>(`${this.webApi}${this.api}${this.DetalleVentas}?idPropietario=${idPropietario}`);
  }
  obtenerDetallesCompras(idPropietario: number):Observable<DetalleCompra[]>{
    return this.http.get<DetalleCompra[]>(`${this.webApi}${this.api}${this.DetalleCompras}?idPropietario=${idPropietario}`);
  }
  obtenerCierreDeCajaDiario(idPropietario: number):Observable<ResumenCierreCaja>{
    return this.http.get<ResumenCierreCaja>(`${this.webApi}${this.api}${this.CierreCaja}?idPropietario=${idPropietario}`);
  }
}
