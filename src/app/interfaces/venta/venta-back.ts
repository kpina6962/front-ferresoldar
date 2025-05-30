export interface Cliente {
    id: number;
    nombre: string;
  }
  
  export interface MetodoPago {
    id: number;
    nombre: string;
  }
  
  export interface Producto {
    idProducto: number;
    nombre: string;
    codigo: string;
    precio: number;
    cantidad: number;
    marca: string;
  }

    export interface ProductoTable {
    idProducto: number;
    nombre: string;
    cantidad: string;
    precio: number;
    marca: string;
  }
  
  export interface DatosVenta {
    clientes: Cliente[];
    metodosPago: MetodoPago[];
    numFactura: number;
    productos: Producto[];
  }

  export interface ListadoVenta{
    id: number;
    numFactura: string;
    valor: number;
    fecha: string;
    cliente: string;
  }
  export interface ListadoCompra{
    id: number;
    numFactura: string;
    valor: number;
    fecha: string;
    cliente: string;
  }
  export interface DetalleFactura {
  numFactura: number;
  producto: string;
  codigo: string,
  marca: string;
  cantidad: number;
  precio: number;
  total: number;
  medida: string;
}
export interface CompraRequest {
  producto: ProductoAddInt[];
  metodosPago: { idMetodoPago: number; valor: number }[];
  idPropietario: number;
  idCliente: number;
  idUsuario: number;
  idMetodoPago: number;
  valorTotal: number;
}
export interface ProductoAddInt {
  idProducto: number,
  cantidad: number
}