'use client';

import React, { useState, useEffect } from 'react';
import {
    X,
    DollarSign,
    Calendar,
    Tag,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    AlertCircle,
    Plus,
} from 'lucide-react';
import {
    TipoTransaccion,
    TransaccionFormData,
    FormErrors,
} from '@/src/types/finance';
import { CATEGORIAS_GASTOS, CATEGORIAS_INGRESOS } from '@/src/utils/formatters';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: {
        monto: number;
        categoria: string;
        descripcion: string | null;
        fecha: string;
        tipo: TipoTransaccion;
    }) => Promise<boolean>;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const defaultTipo: TipoTransaccion = 'gasto';

    const getInitialDate = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const [tipo, setTipo] = useState<TipoTransaccion>(defaultTipo);
    const [monto, setMonto] = useState<string>('');
    const [categoria, setCategoria] = useState<string>('');
    const [customCategoria, setCustomCategoria] = useState<string>('');
    const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
    const [descripcion, setDescripcion] = useState<string>('');
    const [fecha, setFecha] = useState<string>(getInitialDate());

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setTipo('gasto');
            setMonto('');
            setCategoria(CATEGORIAS_GASTOS[0]);
            setCustomCategoria('');
            setIsCustomCategory(false);
            setDescripcion('');
            setFecha(getInitialDate());
            setErrors({});
            setApiError(null);
        }
    }, [isOpen]);

    // Handle category preset update when tipo changes
    const handleTipoChange = (newTipo: TipoTransaccion) => {
        setTipo(newTipo);
        setErrors((prev) => ({ ...prev, categoria: undefined }));
        const defaultCats = newTipo === 'gasto' ? CATEGORIAS_GASTOS : CATEGORIAS_INGRESOS;
        if (!isCustomCategory) {
            setCategoria(defaultCats[0]);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validar Monto
        const montoTrimmed = monto.trim();
        if (!montoTrimmed) {
            newErrors.monto = 'El monto es obligatorio.';
        } else {
            const montoNum = Number(montoTrimmed);
            if (isNaN(montoNum)) {
                newErrors.monto = 'Ingrese un número válido.';
            } else if (montoNum <= 0) {
                newErrors.monto = 'El monto debe ser mayor a $0,00.';
            } else if (montoNum > 1000000000) {
                newErrors.monto = 'El monto excede el límite permitido.';
            }
        }

        // Validar Categoría
        const catFinal = isCustomCategory ? customCategoria.trim() : categoria.trim();
        if (!catFinal) {
            newErrors.categoria = 'La categoría es obligatoria.';
        } else if (catFinal.length > 50) {
            newErrors.categoria = 'La categoría no debe superar los 50 caracteres.';
        }

        // Validar Fecha
        if (!fecha) {
            newErrors.fecha = 'La fecha es obligatoria.';
        }

        // Validar Descripción
        if (descripcion.length > 300) {
            newErrors.descripcion = 'La descripción no debe superar los 300 caracteres.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const finalCategoria = isCustomCategory ? customCategoria.trim() : categoria.trim();
            const fechaIso = new Date(fecha).toISOString();

            const success = await onSubmit({
                monto: parseFloat(monto.trim()),
                categoria: finalCategoria,
                descripcion: descripcion.trim() || null,
                fecha: fechaIso,
                tipo,
            });

            if (success) {
                onClose();
            }
        } catch (err: any) {
            setApiError(err?.message || 'Ocurrió un error inesperado al guardar.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const currentPresets = tipo === 'gasto' ? CATEGORIAS_GASTOS : CATEGORIAS_INGRESOS;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
                    <div className="flex items-center space-x-2">
                        <div
                            className={`p-2 rounded-xl border ${tipo === 'ingreso'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}
                        >
                            {tipo === 'ingreso' ? (
                                <ArrowUpRight className="w-5 h-5" />
                            ) : (
                                <ArrowDownRight className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">
                                Registrar Nueva Transacción
                            </h3>
                            <p className="text-xs text-slate-400">
                                Complete los campos requeridos para auditar el movimiento
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    {/* Error Banner API */}
                    {apiError && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{apiError}</span>
                        </div>
                    )}

                    {/* Selector de Tipo (Gasto vs Ingreso) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                            Tipo de Registro <span className="text-rose-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleTipoChange('gasto')}
                                className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${tipo === 'gasto'
                                        ? 'bg-rose-600/20 text-rose-400 border-rose-500/50 shadow-md shadow-rose-900/20 ring-1 ring-rose-500/50'
                                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <ArrowDownRight className="w-4 h-4" />
                                <span>Gasto Corporal / Egreso</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleTipoChange('ingreso')}
                                className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${tipo === 'ingreso'
                                        ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50 shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/50'
                                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <ArrowUpRight className="w-4 h-4" />
                                <span>Ingreso / Entrante</span>
                            </button>
                        </div>
                    </div>

                    {/* Campo Monto */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Monto (<span className="text-indigo-400">USD $</span>){' '}
                            <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                                $
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={monto}
                                onChange={(e) => {
                                    setMonto(e.target.value);
                                    if (errors.monto) setErrors((prev) => ({ ...prev, monto: undefined }));
                                }}
                                placeholder="0.00"
                                className={`w-full pl-8 pr-4 py-2.5 bg-slate-800/80 border rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${errors.monto
                                        ? 'border-rose-500 focus:ring-rose-500/50'
                                        : 'border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500'
                                    }`}
                            />
                        </div>
                        {errors.monto && (
                            <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.monto}
                            </p>
                        )}
                    </div>

                    {/* Campo Categoría */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-semibold text-slate-300">
                                Categoría <span className="text-rose-400">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCustomCategory(!isCustomCategory);
                                    if (!isCustomCategory) {
                                        setCustomCategoria('');
                                    } else {
                                        setCategoria(currentPresets[0]);
                                    }
                                }}
                                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                            >
                                {isCustomCategory ? 'Elegir prediseñada' : '+ Crear personalizada'}
                            </button>
                        </div>

                        {!isCustomCategory ? (
                            <select
                                value={categoria}
                                onChange={(e) => {
                                    setCategoria(e.target.value);
                                    if (errors.categoria) setErrors((prev) => ({ ...prev, categoria: undefined }));
                                }}
                                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                            >
                                {currentPresets.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={customCategoria}
                                onChange={(e) => {
                                    setCustomCategoria(e.target.value);
                                    if (errors.categoria) setErrors((prev) => ({ ...prev, categoria: undefined }));
                                }}
                                placeholder="Escribe el nombre de la nueva categoría..."
                                className={`w-full px-3.5 py-2.5 bg-slate-800/80 border rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${errors.categoria
                                        ? 'border-rose-500 focus:ring-rose-500/50'
                                        : 'border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500'
                                    }`}
                            />
                        )}

                        {errors.categoria && (
                            <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.categoria}
                            </p>
                        )}
                    </div>

                    {/* Campo Fecha y Hora */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Fecha y Hora <span className="text-rose-400">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={fecha}
                            onChange={(e) => {
                                setFecha(e.target.value);
                                if (errors.fecha) setErrors((prev) => ({ ...prev, fecha: undefined }));
                            }}
                            className={`w-full px-3.5 py-2.5 bg-slate-800/80 border rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 transition-all ${errors.fecha
                                    ? 'border-rose-500 focus:ring-rose-500/50'
                                    : 'border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500'
                                }`}
                        />
                        {errors.fecha && (
                            <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.fecha}
                            </p>
                        )}
                    </div>

                    {/* Campo Descripción */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-semibold text-slate-300">
                                Descripción / Observaciones <span className="text-slate-500">(Opcional)</span>
                            </label>
                            <span className="text-[10px] text-slate-500">
                                {descripcion.length}/300
                            </span>
                        </div>
                        <textarea
                            rows={3}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            maxLength={300}
                            placeholder="Detalles sobre el proveedor, factura o justificación del movimiento..."
                            className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                        />
                        {errors.descripcion && (
                            <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.descripcion}
                            </p>
                        )}
                    </div>

                    {/* Buttons Footer */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all border border-indigo-500/30 flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Confirmar y Guardar</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
