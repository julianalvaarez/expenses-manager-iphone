'use client';

import React from 'react';
import { ResumenMes } from '@/src/types/finance';
import { formatCurrency } from '@/src/utils/formatters';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
} from 'lucide-react';

interface KPICardsProps {
    resumen: ResumenMes;
    periodoNombre: string;
}

export const KPICards: React.FC<KPICardsProps> = ({ resumen, periodoNombre }) => {
    const {
        totalIngresos,
        totalGastos,
        balance,
        tasaAhorro,
        cantidadIngresos,
        cantidadGastos,
        topCategoriaGasto,
    } = resumen;

    const isPositiveBalance = balance >= 0;
    const totalFlujo = totalIngresos + totalGastos;
    const porcentajeGastos = totalFlujo > 0 ? (totalGastos / totalFlujo) * 100 : 0;
    const porcentajeIngresos = totalFlujo > 0 ? (totalIngresos / totalFlujo) * 100 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Card 1: Balance General */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/90 border border-slate-800 p-5 shadow-lg shadow-black/20 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Balance Neto ({periodoNombre})
                    </span>
                    <div className={`p-2 rounded-xl border ${isPositiveBalance ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        <Wallet className="w-4 h-4" />
                    </div>
                </div>
                <div className="flex items-baseline space-x-2">
                    <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isPositiveBalance ? 'text-white' : 'text-rose-400'}`}>
                        {formatCurrency(balance)}
                    </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-800/80 pt-3">
                    <span className="text-slate-400">Margen operativo</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${tasaAhorro >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {tasaAhorro.toFixed(1)}%
                    </span>
                </div>
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
            </div>

            {/* Card 2: Total Ingresos */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg shadow-black/20 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Ingresos Totales
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
                <div className="flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
                        {formatCurrency(totalIngresos)}
                    </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-800/80 pt-3 text-slate-400">
                    <span>{cantidadIngresos} operac. registradas</span>
                    <span className="font-medium text-emerald-400">{porcentajeIngresos.toFixed(0)}% del flujo</span>
                </div>
            </div>

            {/* Card 3: Total Gastos */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg shadow-black/20 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Gastos Totales
                    </span>
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <ArrowDownRight className="w-4 h-4" />
                    </div>
                </div>
                <div className="flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight">
                        {formatCurrency(totalGastos)}
                    </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-800/80 pt-3 text-slate-400">
                    <span>{cantidadGastos} operac. registradas</span>
                    <span className="font-medium text-rose-400">{porcentajeGastos.toFixed(0)}% del flujo</span>
                </div>
            </div>

            {/* Card 4: Top Categoría de Gasto / Salud Financiera */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg shadow-black/20 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Mayor Categoría de Gasto
                    </span>
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <PieChart className="w-4 h-4" />
                    </div>
                </div>
                <div className="truncate">
                    <span className="text-lg font-bold text-white tracking-tight truncate block" title={topCategoriaGasto}>
                        {topCategoriaGasto || 'Sin gastos registrados'}
                    </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-800/80 pt-3 text-slate-400">
                    <span>Distribución mensual</span>
                    <span className="text-indigo-400 font-semibold">Análisis Activo</span>
                </div>
            </div>
        </div>
    );
};
