'use client';

import React from 'react';
import { Transaccion } from '@/src/types/finance';
import { formatCurrency, formatDate } from '@/src/utils/formatters';
import {
    ArrowUpRight,
    ArrowDownRight,
    Trash2,
    Eye,
    Receipt,
    Calendar,
    Tag,
    FileText,
} from 'lucide-react';

interface TransactionTableProps {
    transacciones: Transaccion[];
    isLoading: boolean;
    onViewDetail: (item: Transaccion) => void;
    onDeleteRequest: (item: Transaccion) => void;
    onOpenAddModal: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
    transacciones,
    isLoading,
    onViewDetail,
    onDeleteRequest,
    onOpenAddModal,
}) => {
    if (isLoading) {
        return (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-indigo-500/10 text-indigo-400 mb-4 animate-pulse">
                    <Receipt className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Cargando transacciones...</h3>
                <p className="text-xs text-slate-400">Consultando datos actualizados con el servidor.</p>
            </div>
        );
    }

    if (transacciones.length === 0) {
        return (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800 text-slate-400 mb-4 border border-slate-700">
                    <Receipt className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">No se encontraron movimientos</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                    No hay registros de gastos o ingresos que coincidan con los filtros seleccionados o para este período.
                </p>
                <button
                    onClick={onOpenAddModal}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                    Registrar Primer Movimiento
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Vista Tabla Desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="py-3.5 px-4">Tipo</th>
                            <th className="py-3.5 px-4">Categoría / Concepto</th>
                            <th className="py-3.5 px-4">Fecha</th>
                            <th className="py-3.5 px-4 text-right">Monto</th>
                            <th className="py-3.5 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                        {transacciones.map((item) => {
                            const isIngreso = item.tipo === 'ingreso';

                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-slate-800/40 transition-colors group"
                                >
                                    {/* Tipo Badge */}
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${isIngreso
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}
                                        >
                                            {isIngreso ? (
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            ) : (
                                                <ArrowDownRight className="w-3.5 h-3.5" />
                                            )}
                                            <span>{isIngreso ? 'Ingreso' : 'Gasto'}</span>
                                        </span>
                                    </td>

                                    {/* Categoría y Descripción */}
                                    <td className="py-4 px-4">
                                        <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                            {item.categoria}
                                        </div>
                                        {item.descripcion && (
                                            <p className="text-slate-400 text-[11px] truncate max-w-xs mt-0.5">
                                                {item.descripcion}
                                            </p>
                                        )}
                                    </td>

                                    {/* Fecha */}
                                    <td className="py-4 px-4 whitespace-nowrap text-slate-300">
                                        <div className="flex items-center space-x-1.5 text-slate-400">
                                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                            <span>{formatDate(item.fecha)}</span>
                                        </div>
                                    </td>

                                    {/* Monto */}
                                    <td className="py-4 px-4 whitespace-nowrap text-right font-extrabold">
                                        <span
                                            className={`text-sm ${isIngreso ? 'text-emerald-400' : 'text-rose-400'
                                                }`}
                                        >
                                            {isIngreso ? '+' : '-'}{formatCurrency(item.monto)}
                                        </span>
                                    </td>

                                    {/* Acciones */}
                                    <td className="py-4 px-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => onViewDetail(item)}
                                                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                                                title="Ver Detalle"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteRequest(item)}
                                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Vista Tarjetas Mobile */}
            <div className="block md:hidden divide-y divide-slate-800">
                {transacciones.map((item) => {
                    const isIngreso = item.tipo === 'ingreso';

                    return (
                        <div key={item.id} className="p-4 hover:bg-slate-800/40 transition-colors">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`inline-flex items-center justify-center p-1.5 rounded-lg border ${isIngreso
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}
                                    >
                                        {isIngreso ? (
                                            <ArrowUpRight className="w-4 h-4" />
                                        ) : (
                                            <ArrowDownRight className="w-4 h-4" />
                                        )}
                                    </span>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">{item.categoria}</h4>
                                        <span className="text-[10px] text-slate-400">
                                            {formatDate(item.fecha)}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={`text-sm font-extrabold ${isIngreso ? 'text-emerald-400' : 'text-rose-400'
                                        }`}
                                >
                                    {isIngreso ? '+' : '-'}{formatCurrency(item.monto)}
                                </span>
                            </div>

                            {item.descripcion && (
                                <p className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded-lg mb-3">
                                    {item.descripcion}
                                </p>
                            )}

                            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/60">
                                <button
                                    onClick={() => onViewDetail(item)}
                                    className="px-2.5 py-1 text-xs text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg flex items-center space-x-1 cursor-pointer"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Detalles</span>
                                </button>
                                <button
                                    onClick={() => onDeleteRequest(item)}
                                    className="px-2.5 py-1 text-xs text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg flex items-center space-x-1 cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
