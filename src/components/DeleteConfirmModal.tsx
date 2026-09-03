'use client';

import React from 'react';
import { Transaccion } from '@/src/types/finance';
import { formatCurrency } from '@/src/utils/formatters';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
    item: Transaccion | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    item,
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
}) => {
    if (!isOpen || !item) return null;

    const isIngreso = item.tipo === 'ingreso';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                    ¿Eliminar este {isIngreso ? 'ingreso' : 'gasto'}?
                </h3>

                <p className="text-xs text-slate-400 mb-4">
                    Esta acción eliminará de forma permanente el registro de{' '}
                    <span className="text-white font-bold">{item.categoria}</span> por{' '}
                    <span className={isIngreso ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {formatCurrency(item.monto)}
                    </span>
                    . Esta operación no se puede deshacer.
                </p>

                <div className="flex items-center justify-center space-x-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="w-1/2 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="w-1/2 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 transition-all border border-rose-500/30 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
