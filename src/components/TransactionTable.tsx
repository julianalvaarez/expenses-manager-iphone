'use client';

import React from 'react';
import { Transaccion } from '@/src/types/finance';
import { formatCurrency, formatDate } from '@/src/utils/formatters';
import { ArrowUpRight, ArrowDownRight, Trash2, Eye, Receipt } from 'lucide-react';

interface TransactionTableProps {
    transacciones: Transaccion[];
    isLoading: boolean;
    onViewDetail: (item: Transaccion) => void;
    onDeleteRequest: (item: Transaccion) => void;
    onOpenAddModal: () => void;
    categoriaFilter?: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
    transacciones,
    isLoading,
    onViewDetail,
    onDeleteRequest,
    onOpenAddModal,
    categoriaFilter,
}) => {
    const totalGastadoCategoria = React.useMemo(() => {
        if (!categoriaFilter) return 0;
        return transacciones
            .filter((t) => t.tipo === 'gasto')
            .reduce((acc, t) => acc + t.monto, 0);
    }, [transacciones, categoriaFilter]);
    if (isLoading) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <div className="inline-flex p-3 rounded-full bg-slate-800 text-slate-400 mb-3 animate-pulse">
                    <Receipt className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400">Cargando movimientos...</p>
            </div>
        );
    }

    if (transacciones.length === 0) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <div className="inline-flex p-3 rounded-full bg-slate-800 text-slate-400 mb-3">
                    <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Sin movimientos registrados</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
                    No tienes gastos ni ingresos registrados para el período o filtro actual.
                </p>
                <button
                    onClick={onOpenAddModal}
                    className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                    Agregar movimiento
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-800/80">
                {transacciones.map((item) => {
                    const isIngreso = item.tipo === 'ingreso';

                    return (
                        <div
                            key={item.id}
                            className="p-3.5 sm:p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-3 group"
                        >
                            {/* Left: Icon + Category + Description + Date */}
                            <div className="flex items-center space-x-3 min-w-0">
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isIngreso
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}
                                >
                                    {isIngreso ? (
                                        <ArrowUpRight className="w-4 h-4" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4" />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                                        {item.categoria}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 truncate">
                                        <span>{formatDate(item.fecha)}</span>
                                        {item.descripcion && (
                                            <>
                                                <span>•</span>
                                                <span className="truncate max-w-[150px] sm:max-w-[250px]">{item.descripcion}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Amount + Actions */}
                            <div className="flex items-center space-x-3 shrink-0">
                                <span
                                    className={`text-sm sm:text-base font-bold ${isIngreso ? 'text-emerald-400' : 'text-slate-200'
                                        }`}
                                >
                                    {isIngreso ? '+' : '-'}{formatCurrency(item.monto)}
                                </span>

                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => onViewDetail(item)}
                                        className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                        title="Ver detalle"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteRequest(item)}
                                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {categoriaFilter && (
                <div className="bg-slate-950/80 border-t border-slate-800 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400 font-medium">Total gastado en</span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700/80">
                            {categoriaFilter}
                        </span>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-rose-400">
                        {formatCurrency(totalGastadoCategoria)}
                    </span>
                </div>
            )}
        </div>
    );
};
