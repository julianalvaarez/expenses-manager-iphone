'use client';

import React from 'react';
import { formatMonthKey } from '@/src/utils/formatters';
import { Calendar, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface MonthSelectorProps {
    availableMonths: string[]; // Formato YYYY-MM
    selectedMonth: string; // YYYY-MM o "ALL"
    currentMonthKey: string; // YYYY-MM actual
    onSelectMonth: (monthKey: string) => void;
    monthStats: Record<string, { count: number; balance: number }>;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
    availableMonths,
    selectedMonth,
    currentMonthKey,
    onSelectMonth,
    monthStats,
}) => {
    // Asegurar que el mes actual siempre esté en la lista y ordenados descendentemente
    const sortedMonths = Array.from(new Set([currentMonthKey, ...availableMonths])).sort((a, b) => b.localeCompare(a));

    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                        Período Fiscal / Selección por Mes
                    </h2>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span>Mes principal por defecto:</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                        {formatMonthKey(currentMonthKey)} (Actual)
                    </span>
                </div>
            </div>

            {/* Selector de Pestañas de Meses */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
                {/* Opción Todos los Meses */}
                <button
                    onClick={() => onSelectMonth('ALL')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${selectedMonth === 'ALL'
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80 hover:text-white'
                        }`}
                >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Consolidado Global</span>
                </button>

                {/* Lista de meses */}
                {sortedMonths.map((mKey) => {
                    const isCurrent = mKey === currentMonthKey;
                    const isSelected = selectedMonth === mKey;
                    const stats = monthStats[mKey] || { count: 0, balance: 0 };

                    return (
                        <button
                            key={mKey}
                            onClick={() => onSelectMonth(mKey)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${isSelected
                                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80 hover:text-white'
                                }`}
                        >
                            <span>{formatMonthKey(mKey)}</span>
                            {isCurrent && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${isSelected ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                    Actual
                                </span>
                            )}
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-700 text-slate-400'}`}>
                                {stats.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
