'use client';

import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
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
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por concepto, categoría o notas..."
                        className="w-full pl-10 pr-9 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Filter Controls Row */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Tipo Toggle */}
                    <div className="inline-flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
                        <button
                            onClick={() => onTipoFilterChange('todos')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${tipoFilter === 'todos'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => onTipoFilterChange('ingreso')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${tipoFilter === 'ingreso'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            Ingresos
                        </button>
                        <button
                            onClick={() => onTipoFilterChange('gasto')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${tipoFilter === 'gasto'
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            Gastos
                        </button>
                    </div>

                    {/* Categoría Select */}
                    <div className="relative">
                        <select
                            value={categoriaFilter}
                            onChange={(e) => onCategoriaFilterChange(e.target.value)}
                            className="appearance-none pl-3.5 pr-8 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                        >
                            <option value="">Todas las Categorías</option>
                            {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <Filter className="w-3.5 h-3.5 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>

                    {/* Ordenar Por Select */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => onSortByChange(e.target.value as any)}
                            className="appearance-none pl-3.5 pr-8 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                        >
                            <option value="fecha_desc">Fecha (Más reciente)</option>
                            <option value="fecha_asc">Fecha (Más antigua)</option>
                            <option value="monto_desc">Monto (Mayor primero)</option>
                            <option value="monto_asc">Monto (Menor primero)</option>
                        </select>
                        <ArrowUpDown className="w-3.5 h-3.5 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>

                    {/* Limpiar Filtros */}
                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            className="px-3 py-2 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                            <span>Limpiar</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
