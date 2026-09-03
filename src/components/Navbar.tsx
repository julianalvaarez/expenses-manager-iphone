'use client';

import React from 'react';
import { PlusCircle, RefreshCw, Building2, TrendingUp, ShieldCheck } from 'lucide-react';

interface NavbarProps {
    onOpenAddModal: () => void;
    onRefresh: () => void;
    isRefreshing: boolean;
    totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
    onOpenAddModal,
    onRefresh,
    isRefreshing,
    totalCount,
}) => {
    return (
        <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Brand / Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-xl font-bold text-white tracking-tight">
                                    FinCorp <span className="text-indigo-400 font-normal">| Gestor Financiero</span>
                                </h1>
                                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <ShieldCheck className="w-3 h-3" /> Sistema Empresarial
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Control de Gastos e Ingresos Corporativos ({totalCount} registros)
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="inline-flex items-center justify-center space-x-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-all shadow-sm hover:text-white disabled:opacity-50 cursor-pointer"
                            title="Actualizar datos"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
                            <span className="hidden sm:inline">Sincronizar</span>
                        </button>

                        <button
                            onClick={onOpenAddModal}
                            className="inline-flex items-center justify-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-lg transition-all shadow-lg shadow-indigo-600/30 border border-indigo-400/30 active:scale-98 cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Nueva Transacción</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
