export interface DetalleVenta {
    numFactura: string,
    producto: string,
    id: number,
    codigo: string,
    cantidad: number,
    totalVenta: number,
    marca: string,
    cliente: string
}
export interface DetalleCompra {
    numFactura: number,
    producto: string,
    id: number,
    cantidad: number,
    totalCompra: number,
    marca: string,
    proveedor: string
}