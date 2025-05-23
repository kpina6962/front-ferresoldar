export interface Inventario {
    id: number,
    nombre: string,
    cantidad: number,
    medida: string,
    marca: string,
    seccion: string
}

export interface ProductoViewModel{
    id: number,
    nombre: string,
    precio: number
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
  idMedida: number,
  valor: number,
  idMarca: number,
  idSeccion: number,
  precioVenta: number
}

export interface ProductoBack{
  nombre: string,
  idMedida: number,
  valor: number,
  idMarca: number,
  idSeccion: number,
}

export interface InventarioGenerate{
  idProducto: number,
  cantidad: number,
  idProveedor: number
}
export interface MovimientoInventarioRequest {
  inventarioAgregar: InventarioGenerate[];
  idUsuario: number;
  idPropietario: number;
}