'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error';
    text: string;
}

interface ToastProps {
    toasts: ToastMessage[];
    onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${toast.type === 'success'
                            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-950/90 border-rose-500/30 text-rose-200'
                        }`}
                >
                    <div className="flex items-center space-x-3">
                        {toast.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                        <p className="text-xs font-medium">{toast.text}</p>
                    </div>
                    <button
                        onClick={() => onDismiss(toast.id)}
                        className="p-1 hover:opacity-75 rounded transition-opacity cursor-pointer ml-3"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
