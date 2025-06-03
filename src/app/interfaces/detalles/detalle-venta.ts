export interface DetalleVenta {
    numFactura: string,
    producto: string,
    codigo: string,
    cantidad: number,
    totalVenta: number,
    marca: string,
    cliente: string
}
export interface DetalleCompra {
    numFactura: number,
    producto: string,
    codigo: string,
    cantidad: number,
    totalCompra: number,
    marca: string,
    proveedor: string
}