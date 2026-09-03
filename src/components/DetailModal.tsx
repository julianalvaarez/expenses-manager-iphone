'use client';

import React from 'react';
import { Transaccion } from '@/src/types/finance';
import { formatCurrency, formatDate } from '@/src/utils/formatters';
import { X, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';

interface DetailModalProps {
    item: Transaccion | null;
    onClose: () => void;
    onDeleteRequest: (item: Transaccion) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
    item,
    onClose,
    onDeleteRequest,
}) => {
    if (!item) return null;

    const isIngreso = item.tipo === 'ingreso';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <span className="text-xs font-semibold text-slate-400">Detalle de movimiento</span>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-center py-3 mb-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">{item.categoria}</div>
                    <div className={`text-2xl font-bold ${isIngreso ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isIngreso ? '+' : '-'}{formatCurrency(item.monto)}
                    </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 mb-5">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-500">Fecha:</span>
                        <span>{formatDate(item.fecha)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-500">Tipo:</span>
                        <span className={isIngreso ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                            {isIngreso ? 'Ingreso' : 'Gasto'}
                        </span>
                    </div>
                    {item.descripcion && (
                        <div className="pt-2">
                            <span className="text-slate-500 block mb-1">Nota:</span>
                            <p className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                                {item.descripcion}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                        onClick={() => {
                            onClose();
                            onDeleteRequest(item);
                        }}
                        className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
