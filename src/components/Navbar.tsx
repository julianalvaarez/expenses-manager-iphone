'use client';

import React from 'react';
import { Plus, RefreshCw, Wallet } from 'lucide-react';

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
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
                            <Wallet className="w-5 h-5 text-slate-950" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">
                                Mis Finanzas
                            </h1>
                            <p className="text-xs text-slate-400">
                                {totalCount === 1 ? '1 movimiento registrado' : `${totalCount} movimientos registrados`}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700/60 disabled:opacity-50 cursor-pointer"
                            title="Actualizar"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
                        </button>

                        <button
                            onClick={onOpenAddModal}
                            className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                        >
                            <Plus className="w-4 h-4 stroke-[3]" />
                            <span>Agregar</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
