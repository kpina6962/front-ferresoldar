export interface Venta {
}

export interface ProductoVentaViewModel{
    IdProducto: number,
    Cantidad: number
}

export interface DatosViewModel {
    IdPropietario: number,
    IdCliente: number,
    IdUsuario: number,
    IdMetodoPago:  number
}

export interface VentaViewModel{
    producto: ProductoVentaViewModel[],
    IdPropietario: number,
    IdCliente: number,
    IdUsuario: number,
    IdMetodoPago:  number
}