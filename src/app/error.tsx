'use client';

import { useEffect } from 'react';
import { Building2, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Unhandled App Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
            {/* Minimal Header */}
            <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">
                        FinCorp <span className="text-indigo-400 font-normal">| Error de Sistema</span>
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-md w-full mx-auto text-center py-12 px-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6">
                    <AlertTriangle className="w-10 h-10" />
                </div>

                <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                    Ocurrió un inconveniente inesperado
                </h1>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    El sistema ha detectado una excepción en la interfaz. Puedes reintentar la operación o volver a cargar el dashboard.
                </p>

                {error?.message && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-400 text-left mb-6 truncate">
                        {error.message}
                    </div>
                )}

                <button
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all border border-indigo-500/30 cursor-pointer"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reintentar aplicación</span>
                </button>
            </main>

            {/* Footer */}
            <footer className="text-center text-xs text-slate-600 py-4">
                <p>FinCorp Enterprise Systems • Global Error Boundary</p>
            </footer>
        </div>
    );
}
