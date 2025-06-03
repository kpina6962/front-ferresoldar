export interface Inventario {
    id: number,
    codigo: string,
    nombre: string,
    cantidad: number,
    medida: string,
    marca: string,
    seccion: string
}

export interface ProductoViewModel{
    id: number,
    codigo: string,
    nombre: string,
    descripcion: string,
    valor: number
}

export interface SimpleViewModel {
  id: number;
  nombre: string;
}

export interface FormProducto {
  marca: SimpleViewModel[];
  seccion: SimpleViewModel[];
  medida: SimpleViewModel[];
}

export interface ProductoAdd{
  nombre: string,
  codigo: string,
  descripcion: string,
  idMedida: number,
  valor: number,
  idMarca: number,
  idSeccion: number,
  valorVenta: number
}

export interface InventarioGenerate{
  idProducto: number,
  cantidad: number,
  idProveedor: number
}
export interface MovimientoInventarioRequest {
  inventarioAgregar: InventarioGenerate[];
  idUsuario: number;
  idMetodoPago: number;
  valor: number;
}
export interface InformacionProducto{
  codigo: string,
  nombre: string,
  descripcion: string,
  marca: string,
  medida: string,
  seccion: string,
  totalUnidadesCompradas: number,
  totalUnidadesVendidas: number,
  totalComprado: number,
  totalVendido: number
}