'use client';

import React from 'react';
import { Transaccion } from '@/src/types/finance';
import { formatCurrency } from '@/src/utils/formatters';
import { Trash2 } from 'lucide-react';

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="relative w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
                    <Trash2 className="w-5 h-5" />
                </div>

                <h3 className="text-sm font-bold text-white mb-1">¿Eliminar registro?</h3>

                <p className="text-xs text-slate-400 mb-4">
                    Se borrará <span className="text-white font-semibold">{item.categoria}</span> ({formatCurrency(item.monto)}).
                </p>

                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="w-1/2 py-2 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="w-1/2 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                        {isDeleting ? 'Borrando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
