'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { TipoTransaccion } from '@/src/types/finance';

interface TransactionFiltersProps {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    tipoFilter: 'todos' | TipoTransaccion;
    onTipoFilterChange: (tipo: 'todos' | TipoTransaccion) => void;
    categoriaFilter: string;
    onCategoriaFilterChange: (cat: string) => void;
    availableCategories: string[];
    sortBy: 'fecha_desc' | 'fecha_asc' | 'monto_desc' | 'monto_asc';
    onSortByChange: (sort: 'fecha_desc' | 'fecha_asc' | 'monto_desc' | 'monto_asc') => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
    searchQuery,
    onSearchChange,
    tipoFilter,
    onTipoFilterChange,
    categoriaFilter,
    onCategoriaFilterChange,
    availableCategories,
    sortBy,
    onSortByChange,
    onClearFilters,
    hasActiveFilters,
}) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-2">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por concepto o categoría..."
                        className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Tipo Toggle */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
                    <button
                        onClick={() => onTipoFilterChange('todos')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${tipoFilter === 'todos' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => onTipoFilterChange('ingreso')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${tipoFilter === 'ingreso' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Ingresos
                    </button>
                    <button
                        onClick={() => onTipoFilterChange('gasto')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${tipoFilter === 'gasto' ? 'bg-rose-500/20 text-rose-400 font-semibold' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Gastos
                    </button>
                </div>

                {/* Categoría & Sort */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <select
                        value={categoriaFilter}
                        onChange={(e) => onCategoriaFilterChange(e.target.value)}
                        className="flex-1 sm:flex-none px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer"
                    >
                        <option value="">Categorías</option>
                        {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                            title="Limpiar filtros"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
