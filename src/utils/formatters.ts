// Formateador de Moneda en formato EUR / USD / ARS adaptable
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Formateador de Fecha readable (ej: 03 de Septiembre, 2026 - 14:30)
export const formatDate = (dateIso: string): string => {
    try {
        const date = new Date(dateIso);
        if (isNaN(date.getTime())) return dateIso;
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    } catch {
        return dateIso;
    }
};

// Obtener clave del mes YYYY-MM a partir de una fecha ISO o Date
export const getMonthKey = (dateInput: string | Date): string => {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

// Convertir YYYY-MM en un nombre legible (ej: "Septiembre 2026")
export const formatMonthKey = (monthKey: string): string => {
    const [yearStr, monthStr] = monthKey.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    if (isNaN(year) || isNaN(month)) return monthKey;

    const date = new Date(year, month, 1);
    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
};

// Categorías empresariales predeterminadas
export const CATEGORIAS_GASTOS = [
    'Servicios y Suministros',
    'Nómina y Salarios',
    'Marketing y Publicidad',
    'Software y Licencias',
    'Infraestructura y Servidores',
    'Viajes y Viáticos',
    'Impuestos y Tasas',
    'Mantenimiento u Oficina',
    'Consultoría Externa',
    'Otros Gastos',
];

export const CATEGORIAS_INGRESOS = [
    'Ventas de Productos',
    'Servicios Profesionales',
    'Suscripciones / SaaS',
    'Inversiones y Dividendos',
    'Consultoría y Asesoría',
    'Reembolsos / Devoluciones',
    'Subvenciones y Financiamiento',
    'Otros Ingresos',
];
