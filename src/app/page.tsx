'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaccion, ResumenMes, TipoTransaccion } from '@/src/types/finance';
import { getMonthKey, formatMonthKey } from '@/src/utils/formatters';
import { Navbar } from '@/src/components/Navbar';
import { KPICards } from '@/src/components/KPICards';
import { MonthSelector } from '@/src/components/MonthSelector';
import { TransactionFilters } from '@/src/components/TransactionFilters';
import { TransactionTable } from '@/src/components/TransactionTable';
import { TransactionModal } from '@/src/components/TransactionModal';
import { DetailModal } from '@/src/components/DetailModal';
import { DeleteConfirmModal } from '@/src/components/DeleteConfirmModal';
import { Toast, ToastMessage } from '@/src/components/Toast';
import { Sparkles, BarChart3, AlertCircle } from 'lucide-react';

export default function Home() {
  // State principal
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Obtener la clave YYYY-MM del mes actual (ej: "2026-09")
  const currentMonthKey = useMemo(() => getMonthKey(new Date()), []);

  // Filtros y Selección de Mes (Por defecto el mes actual como principal)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tipoFilter, setTipoFilter] = useState<'todos' | TipoTransaccion>('todos');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'fecha_desc' | 'fecha_asc' | 'monto_desc' | 'monto_asc'>('fecha_desc');

  // Modales y Notificaciones
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<Transaccion | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Transaccion | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toasts System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // -------------------------------------------------------------
  // CARGAR GASTOS/INGRESOS (GET /api/gastos)
  // -------------------------------------------------------------
  const fetchTransacciones = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/gastos');
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudieron obtener las transacciones');
      }

      setTransacciones(data.gastos || []);
    } catch (err: any) {
      console.error('Error al obtener gastos:', err);
      setFetchError(err.message || 'Error de conexión con la API.');
      addToast('error', 'Error al cargar los datos del servidor.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTransacciones();
  }, [fetchTransacciones]);

  // -------------------------------------------------------------
  // CREAR NUEVA TRANSACCIÓN (POST /api/gastos)
  // -------------------------------------------------------------
  const handleCreateTransaccion = async (formData: {
    monto: number;
    categoria: string;
    descripcion: string | null;
    fecha: string;
    tipo: TipoTransaccion;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo guardar el registro');
      }

      addToast('success', `${formData.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'} registrado correctamente.`);
      await fetchTransacciones(true);
      return true;
    } catch (err: any) {
      console.error('Error al guardar:', err);
      addToast('error', err.message || 'No se pudo guardar la transacción.');
      return false;
    }
  };

  // -------------------------------------------------------------
  // ELIMINAR TRANSACCIÓN (DELETE /api/gastos/[id])
  // -------------------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/gastos/${itemToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo eliminar la transacción');
      }

      addToast('success', 'Registro eliminado correctamente.');
      setItemToDelete(null);
      if (selectedDetailItem?.id === itemToDelete.id) {
        setSelectedDetailItem(null);
      }
      await fetchTransacciones(true);
    } catch (err: any) {
      console.error('Error al eliminar:', err);
      addToast('error', err.message || 'No se pudo eliminar el registro.');
    } finally {
      setIsDeleting(false);
    }
  };

  // -------------------------------------------------------------
  // DETALLE DE TRANSACCIÓN (GET /api/gastos/[id])
  // -------------------------------------------------------------
  const handleViewDetail = async (item: Transaccion) => {
    try {
      const res = await fetch(`/api/gastos/${item.id}`);
      const data = await res.json();
      if (res.ok && data.success && data.gasto) {
        setSelectedDetailItem(data.gasto);
      } else {
        setSelectedDetailItem(item);
      }
    } catch {
      setSelectedDetailItem(item);
    }
  };

  // -------------------------------------------------------------
  // CÁLCULOS Y DERIVADOS POR MES
  // -------------------------------------------------------------
  // Extraer lista de meses únicos presentes en las transacciones
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    transacciones.forEach((t) => {
      const key = getMonthKey(t.fecha);
      set.add(key);
    });
    return Array.from(set);
  }, [transacciones]);

  // Estadísticas rápidas por mes
  const monthStats = useMemo(() => {
    const stats: Record<string, { count: number; balance: number }> = {};
    transacciones.forEach((t) => {
      const key = getMonthKey(t.fecha);
      if (!stats[key]) {
        stats[key] = { count: 0, balance: 0 };
      }
      stats[key].count += 1;
      stats[key].balance += t.tipo === 'ingreso' ? t.monto : -t.monto;
    });
    return stats;
  }, [transacciones]);

  // Categorías disponibles para filtro
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    transacciones.forEach((t) => {
      if (t.categoria) set.add(t.categoria);
    });
    return Array.from(set).sort();
  }, [transacciones]);

  // Transacciones filtradas por Mes, Tipo, Búsqueda, Categoría y Ordenamiento
  const filteredTransacciones = useMemo(() => {
    return transacciones
      .filter((t) => {
        // Filtro por Mes
        if (selectedMonth !== 'ALL') {
          const tMonthKey = getMonthKey(t.fecha);
          if (tMonthKey !== selectedMonth) return false;
        }

        // Filtro por Tipo
        if (tipoFilter !== 'todos' && t.tipo !== tipoFilter) {
          return false;
        }

        // Filtro por Categoría
        if (categoriaFilter && t.categoria !== categoriaFilter) {
          return false;
        }

        // Filtro por Búsqueda
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const inCategory = t.categoria.toLowerCase().includes(q);
          const inDesc = t.descripcion ? t.descripcion.toLowerCase().includes(q) : false;
          const inMonto = t.monto.toString().includes(q);
          if (!inCategory && !inDesc && !inMonto) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'fecha_desc') {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        }
        if (sortBy === 'fecha_asc') {
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        }
        if (sortBy === 'monto_desc') {
          return b.monto - a.monto;
        }
        if (sortBy === 'monto_asc') {
          return a.monto - b.monto;
        }
        return 0;
      });
  }, [transacciones, selectedMonth, tipoFilter, categoriaFilter, searchQuery, sortBy]);

  // Resumen Ejecutivo / KPI del Período Seleccionado
  const resumenPeriodo = useMemo<ResumenMes>(() => {
    let totalIngresos = 0;
    let totalGastos = 0;
    let cantidadIngresos = 0;
    let cantidadGastos = 0;
    const gastosPorCat: Record<string, number> = {};

    // Filtrar transacciones del mes seleccionado (sin los demás filtros de búsqueda/tipo) para mantener KPI exacto del mes
    const transaccionesDelMes = transacciones.filter((t) => {
      if (selectedMonth === 'ALL') return true;
      return getMonthKey(t.fecha) === selectedMonth;
    });

    transaccionesDelMes.forEach((t) => {
      if (t.tipo === 'ingreso') {
        totalIngresos += t.monto;
        cantidadIngresos += 1;
      } else {
        totalGastos += t.monto;
        cantidadGastos += 1;
        gastosPorCat[t.categoria] = (gastosPorCat[t.categoria] || 0) + t.monto;
      }
    });

    const balance = totalIngresos - totalGastos;
    const tasaAhorro = totalIngresos > 0 ? ((totalIngresos - totalGastos) / totalIngresos) * 100 : 0;

    // Determinar Top Categoría de Gasto
    let topCategoriaGasto = '';
    let maxMonto = 0;
    Object.entries(gastosPorCat).forEach(([cat, amount]) => {
      if (amount > maxMonto) {
        maxMonto = amount;
        topCategoriaGasto = cat;
      }
    });

    return {
      totalIngresos,
      totalGastos,
      balance,
      tasaAhorro,
      cantidadIngresos,
      cantidadGastos,
      topCategoriaGasto,
    };
  }, [transacciones, selectedMonth]);

  const hasActiveFilters = searchQuery !== '' || tipoFilter !== 'todos' || categoriaFilter !== '';

  const handleClearFilters = () => {
    setSearchQuery('');
    setTipoFilter('todos');
    setCategoriaFilter('');
  };

  const periodoNombre = selectedMonth === 'ALL' ? 'Consolidado' : formatMonthKey(selectedMonth);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header / Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onRefresh={() => fetchTransacciones(true)}
        isRefreshing={isRefreshing}
        totalCount={transacciones.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Banner en caso de fallar conexión */}
        {fetchError && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={() => fetchTransacciones(true)}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded-lg font-bold text-white transition-all cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* KPICards (Metricas Financieras Ejecutivas) */}
        <KPICards resumen={resumenPeriodo} periodoNombre={periodoNombre} />

        {/* MonthSelector (Selección de Meses con Mes Actual como Principal) */}
        <MonthSelector
          availableMonths={availableMonths}
          selectedMonth={selectedMonth}
          currentMonthKey={currentMonthKey}
          onSelectMonth={setSelectedMonth}
          monthStats={monthStats}
        />

        {/* Search & Filters */}
        <TransactionFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tipoFilter={tipoFilter}
          onTipoFilterChange={setTipoFilter}
          categoriaFilter={categoriaFilter}
          onCategoriaFilterChange={setCategoriaFilter}
          availableCategories={availableCategories}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Table / List Header Title */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Historial de Movimientos ({filteredTransacciones.length})
            </h3>
          </div>
          {hasActiveFilters && (
            <span className="text-xs text-indigo-400">
              Filtros aplicados en {periodoNombre}
            </span>
          )}
        </div>

        {/* Transaction Table / Card List */}
        <TransactionTable
          transacciones={filteredTransacciones}
          isLoading={isLoading}
          onViewDetail={handleViewDetail}
          onDeleteRequest={setItemToDelete}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* Modales */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTransaccion}
      />

      <DetailModal
        item={selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        onDeleteRequest={(item) => setItemToDelete(item)}
      />

      <DeleteConfirmModal
        item={itemToDelete}
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Global Toasts Notification */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Footer Corporativo */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>FinCorp Expense & Income Management Dashboard • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
