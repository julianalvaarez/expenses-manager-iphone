'use client';

import React from 'react';
import { formatMonthKey } from '@/src/utils/formatters';

interface MonthSelectorProps {
    availableMonths: string[];
    selectedMonth: string;
    currentMonthKey: string;
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
    const sortedMonths = Array.from(new Set([currentMonthKey, ...availableMonths])).sort((a, b) => b.localeCompare(a));

    return (
        <div className="mb-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                    onClick={() => onSelectMonth('ALL')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${selectedMonth === 'ALL'
                            ? 'bg-emerald-400 text-slate-950 font-bold border-emerald-400'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                >
                    Todos los meses
                </button>

                {sortedMonths.map((mKey) => {
                    const isCurrent = mKey === currentMonthKey;
                    const isSelected = selectedMonth === mKey;
                    const stats = monthStats[mKey] || { count: 0, balance: 0 };

                    return (
                        <button
                            key={mKey}
                            onClick={() => onSelectMonth(mKey)}
                            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${isSelected
                                    ? 'bg-emerald-400 text-slate-950 font-bold border-emerald-400'
                                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                                }`}
                        >
                            <span>{formatMonthKey(mKey)}</span>
                            {isCurrent && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    Actual
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
