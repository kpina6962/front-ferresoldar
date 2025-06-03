import { MetodoPagoData, ProductoMasVendidoDto, ReporteInventario, ReporteSemanal, ResumenCierreCaja } from './../../interfaces/reportes/reporte-back';
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
  private cierreCajaMensual: string = 'cierre-caja?'
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
  private EstadosCuenta: string = 'estados-de-cuenta'
  constructor(private http: HttpClient) { }
  //Estadisticas
  obtenerReporte():Observable<ReporteBack> {
    return this.http.get<ReporteBack>(`${this.webApi}${this.api}${this.reportes}`);
  }
  obtenerReporteMensual(year: number):Observable<ReporteMensual[]>{
    return this.http.get<ReporteMensual[]>(`${this.webApi}${this.api}${this.reporteMensual}?year=${year}`)
  }
  obtenerReporteSemanal(year: number, mes: number):Observable<ReporteSemanal[]>{
    return this.http.get<ReporteSemanal[]>(`${this.webApi}${this.api}${this.ReporteSemanalu}?year=${year}&mes=${mes}`)
  }
  //Resumen
  obtenerReporteInventario(idPropietario: number):Observable<ReporteInventario[]>{
    return this.http.get<ReporteInventario[]>(`${this.webApi}${this.api}${this.ReporteInventariou}?idPropietario=${idPropietario}`)
  }
  getMarcas(): Observable<{ id: number, nombre: string }[]> {
    return this.http.get<{ id: number, nombre: string }[]>(`${this.webApi}${this.ObtenerMarca}`); // Ajusta la URL a tu API
  }

  getProductosMasVendidos(idMarca?: number, fechaInicio?: Date, fechaFin?: Date): Observable<ProductoMasVendidoDto[]> {
    let params = new HttpParams();
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
  getProductosMasComprado(idMarca?: number, fechaInicio?: Date, fechaFin?: Date): Observable<ProductoMasVendidoDto[]> {
    let params = new HttpParams();
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
  obtenerDetallesVenta():Observable<DetalleVenta[]>{
    return this.http.get<DetalleVenta[]>(`${this.webApi}${this.api}${this.DetalleVentas}`);
  }
  obtenerDetallesCompras():Observable<DetalleCompra[]>{
    return this.http.get<DetalleCompra[]>(`${this.webApi}${this.api}${this.DetalleCompras}`);
  }
  obtenerCierreDeCajaDiario():Observable<ResumenCierreCaja>{
    return this.http.get<ResumenCierreCaja>(`${this.webApi}${this.api}${this.CierreCaja}`);
  }
  obtenerEstadosDeCuenta():Observable<MetodoPagoData[]>{
    return this.http.get<MetodoPagoData[]>(`${this.webApi}${this.api}${this.EstadosCuenta}`);
  }
  obtenerCierreCaja(idMes: number, year: number):Observable<any>{
    return this.http.get<any>(`${this.webApi}${this.api}${this.cierreCajaMensual}mes=${idMes}&year=${year}`);
  }
}
