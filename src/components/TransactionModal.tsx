'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TipoTransaccion, FormErrors } from '@/src/types/finance';
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
    const getInitialDate = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const [tipo, setTipo] = useState<TipoTransaccion>('gasto');
    const [monto, setMonto] = useState<string>('');
    const [categoria, setCategoria] = useState<string>('');
    const [customCategoria, setCustomCategoria] = useState<string>('');
    const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
    const [descripcion, setDescripcion] = useState<string>('');
    const [fecha, setFecha] = useState<string>(getInitialDate());

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);

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

        const montoTrimmed = monto.trim();
        if (!montoTrimmed) {
            newErrors.monto = 'El monto es obligatorio.';
        } else {
            const montoNum = Number(montoTrimmed);
            if (isNaN(montoNum)) {
                newErrors.monto = 'Ingresa un número válido.';
            } else if (montoNum <= 0) {
                newErrors.monto = 'El monto debe ser mayor a $0,00.';
            }
        }

        const catFinal = isCustomCategory ? customCategoria.trim() : categoria.trim();
        if (!catFinal) {
            newErrors.categoria = 'La categoría es obligatoria.';
        }

        if (!fecha) {
            newErrors.fecha = 'La fecha es obligatoria.';
        }

        if (descripcion.length > 300) {
            newErrors.descripcion = 'La nota no debe superar los 300 caracteres.';
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
            setApiError(err?.message || 'Error al guardar el movimiento.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const currentPresets = tipo === 'gasto' ? CATEGORIAS_GASTOS : CATEGORIAS_INGRESOS;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">
                        {tipo === 'gasto' ? 'Agregar Gasto' : 'Agregar Ingreso'}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {apiError && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{apiError}</span>
                        </div>
                    )}

                    {/* Tipo Switch */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                        <button
                            type="button"
                            onClick={() => handleTipoChange('gasto')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${tipo === 'gasto'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <ArrowDownRight className="w-4 h-4" />
                            <span>Gasto</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTipoChange('ingreso')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${tipo === 'ingreso'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            <span>Ingreso</span>
                        </button>
                    </div>

                    {/* Monto */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                            Monto ($)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
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
                                className={`w-full pl-8 pr-4 py-2.5 bg-slate-950 border rounded-xl text-sm font-bold text-white placeholder-slate-600 focus:outline-none ${errors.monto ? 'border-rose-500' : 'border-slate-800 focus:border-slate-700'
                                    }`}
                            />
                        </div>
                        {errors.monto && (
                            <p className="mt-1 text-xs text-rose-400">{errors.monto}</p>
                        )}
                    </div>

                    {/* Categoría */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-slate-400">Categoría</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCustomCategory(!isCustomCategory);
                                    if (!isCustomCategory) setCustomCategoria('');
                                    else setCategoria(currentPresets[0]);
                                }}
                                className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                            >
                                {isCustomCategory ? 'Elegir lista' : '+ Nueva categoría'}
                            </button>
                        </div>

                        {!isCustomCategory ? (
                            <select
                                value={categoria}
                                onChange={(e) => {
                                    setCategoria(e.target.value);
                                    if (errors.categoria) setErrors((prev) => ({ ...prev, categoria: undefined }));
                                }}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
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
                                placeholder="Nombre de categoría..."
                                className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none ${errors.categoria ? 'border-rose-500' : 'border-slate-800'
                                    }`}
                            />
                        )}
                        {errors.categoria && (
                            <p className="mt-1 text-xs text-rose-400">{errors.categoria}</p>
                        )}
                    </div>

                    {/* Fecha */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Fecha</label>
                        <input
                            type="datetime-local"
                            value={fecha}
                            onChange={(e) => {
                                setFecha(e.target.value);
                                if (errors.fecha) setErrors((prev) => ({ ...prev, fecha: undefined }));
                            }}
                            className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-xs text-white focus:outline-none ${errors.fecha ? 'border-rose-500' : 'border-slate-800'
                                }`}
                        />
                        {errors.fecha && (
                            <p className="mt-1 text-xs text-rose-400">{errors.fecha}</p>
                        )}
                    </div>

                    {/* Nota */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Nota (Opcional)</label>
                        <textarea
                            rows={2}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            maxLength={300}
                            placeholder="Detalle o nota personal..."
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Footer buttons */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span>Guardando...</span>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Guardar</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
