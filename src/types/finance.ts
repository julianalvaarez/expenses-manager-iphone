export type TipoTransaccion = 'gasto' | 'ingreso';

export interface Transaccion {
    id: string;
    monto: number;
    categoria: string;
    descripcion: string | null;
    fecha: string;
    tipo: TipoTransaccion;
    created_at?: string;
}

export interface TransaccionFormData {
    monto: string;
    categoria: string;
    customCategoria?: string;
    descripcion: string;
    fecha: string;
    tipo: TipoTransaccion;
}

export interface FormErrors {
    monto?: string;
    categoria?: string;
    fecha?: string;
    descripcion?: string;
}

export interface ResumenMes {
    totalIngresos: number;
    totalGastos: number;
    balance: number;
    tasaAhorro: number;
    cantidadIngresos: number;
    cantidadGastos: number;
    topCategoriaGasto: string;
}
