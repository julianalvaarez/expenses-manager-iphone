'use client';

import React from 'react';
import { ResumenMes } from '@/src/types/finance';
import { formatCurrency } from '@/src/utils/formatters';
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart } from 'lucide-react';

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
        topCategoriaGasto,
    } = resumen;

    const isPositiveBalance = balance >= 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {/* Balance General */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Balance ({periodoNombre})</span>
                    <Wallet className="w-4 h-4 text-slate-400" />
                </div>
                <div className={`text-2xl font-bold ${isPositiveBalance ? 'text-white' : 'text-rose-400'}`}>
                    {formatCurrency(balance)}
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                    Ahorro estim.: <span className={tasaAhorro >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>{tasaAhorro.toFixed(0)}%</span>
                </div>
            </div>

            {/* Total Ingresos */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Ingresos</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(totalIngresos)}
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                    Total ingresado
                </div>
            </div>

            {/* Total Gastos */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Gastos</span>
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-bold text-rose-400">
                    {formatCurrency(totalGastos)}
                </div>
                <div className="mt-2 text-[11px] text-slate-400 truncate">
                    Mayor gasto: <span className="text-slate-200 font-medium">{topCategoriaGasto || 'Ninguno'}</span>
                </div>
            </div>
        </div>
    );
};
