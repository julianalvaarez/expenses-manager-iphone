'use client';

import React from 'react';
import { Transaccion } from '@/src/types/finance';
import { formatCurrency, formatDate } from '@/src/utils/formatters';
import {
    X,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Tag,
    FileText,
    Hash,
    Clock,
} from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Detalle Auditoría #
                        </span>
                        <span className="text-xs font-mono text-indigo-400 truncate max-w-[120px]">
                            {item.id}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Amount Banner */}
                    <div className={`p-5 rounded-2xl border text-center ${isIngreso
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/40 border border-current mb-2">
                            {isIngreso ? (
                                <>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                    <span>Ingreso Corporativo</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="w-3.5 h-3.5" />
                                    <span>Gasto / Egreso</span>
                                </>
                            )}
                        </div>
                        <div className="text-3xl font-black tracking-tight">
                            {isIngreso ? '+' : '-'}{formatCurrency(item.monto)}
                        </div>
                    </div>

                    {/* Meta Fields */}
                    <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 text-xs">
                        <div className="flex items-start justify-between py-1 border-b border-slate-800/60">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5 text-indigo-400" /> Categoría:
                            </span>
                            <span className="font-bold text-white text-right">{item.categoria}</span>
                        </div>

                        <div className="flex items-start justify-between py-1 border-b border-slate-800/60">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Fecha del movimiento:
                            </span>
                            <span className="font-medium text-slate-200 text-right">{formatDate(item.fecha)}</span>
                        </div>

                        {item.created_at && (
                            <div className="flex items-start justify-between py-1 border-b border-slate-800/60">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-500" /> Creado en sistema:
                                </span>
                                <span className="text-slate-400 font-mono text-[11px] text-right">{formatDate(item.created_at)}</span>
                            </div>
                        )}

                        <div className="pt-2">
                            <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Descripción u Observaciones:
                            </span>
                            <p className="text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs leading-relaxed">
                                {item.descripcion || 'Sin observaciones adicionales proporcionadas.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
                    <button
                        onClick={() => {
                            onClose();
                            onDeleteRequest(item);
                        }}
                        className="px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all cursor-pointer"
                    >
                        Eliminar Registro
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 cursor-pointer"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
