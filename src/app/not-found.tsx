import Link from 'next/link';
import { Building2, ArrowLeft, ShieldAlert, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
            {/* Minimal Header */}
            <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">
                        FinCorp <span className="text-indigo-400 font-normal">| 404</span>
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-md w-full mx-auto text-center py-12 px-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">
                    <ShieldAlert className="w-10 h-10" />
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-indigo-400 border border-slate-700 uppercase tracking-widest inline-block mb-3">
                    Error 404 • Recurso no encontrado
                </span>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                    Página no disponible
                </h1>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-8">
                    La dirección o recurso que intentas consultar no existe o ha sido reubicado en el sistema de gestión financiera de FinCorp.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all border border-indigo-500/30 active:scale-98"
                    >
                        <Home className="w-4 h-4" />
                        <span>Volver al Dashboard Principal</span>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-xs text-slate-600 py-4">
                <p>FinCorp Enterprise Systems • Error Handling Module</p>
            </footer>
        </div>
    );
}
