import React from 'react';
import { useDashboard } from 'hooks/dashboard/Usedashboard';
import LoadingScreen from 'components/Shared/LoadingScreen';
import KpiCards from './KpiCards';
import VentasPorDiaChart from './VentasPorDiaChart';
import MetodoPagoChart from './MetodoPagoChart';
import TopProductos from './TopProductos';
import OrdenesTipoChart from './OrdenesTipoChart';
import ActividadReciente from './ActividadReciente';
import MovimientosKardex from './MovimientosKardex';
import UsuariosResumen from './UsuariosResumen';
import { ChartBarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const PERIODOS = [
    { key: 'hoy',    label: 'Hoy' },
    { key: 'semana', label: 'Sem' },
    { key: 'mes',    label: 'Mes' },
    { key: 'año',    label: 'Año' },
];

const Dashboard = () => {
    const { data, loading, error, periodo, cambiarPeriodo, recargar } = useDashboard();

    if (loading) return <LoadingScreen />;
    if (error) return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <p className="text-red-500 font-semibold text-center">{error}</p>
        </div>
    );

    return (
        <div className="w-full max-w-full overflow-x-hidden px-3 py-4 md:px-6 md:py-6 min-h-screen space-y-4 md:space-y-6">

            {/* Cabecera */}
            <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 shrink-0">
                        <ChartBarIcon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-base font-black text-slate-800 uppercase tracking-tight leading-none">
                            Panel de Control
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Resumen general del negocio
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Selector de período */}
                    <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5 flex-1 sm:flex-none">
                        {PERIODOS.map(p => (
                            <button
                                key={p.key}
                                onClick={() => cambiarPeriodo(p.key)}
                                className={`flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all ${
                                    periodo === p.key
                                        ? 'bg-white text-slate-800 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={recargar}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
                        title="Recargar datos"
                    >
                        <ArrowPathIcon className="w-4 h-4 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <KpiCards kpis={data.kpis} />

            {/* Ventas por día + método de pago */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 min-w-0">
                    <VentasPorDiaChart datos={data.ventas_por_dia} />
                </div>
                <div className="min-w-0">
                    <MetodoPagoChart datos={data.ventas_por_metodo} />
                </div>
            </div>

            {/* Top productos + órdenes por tipo */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 min-w-0">
                    <TopProductos datos={data.top_productos} />
                </div>
                <div className="min-w-0">
                    <OrdenesTipoChart datos={data.ordenes_por_tipo} />
                </div>
            </div>

            {/* Kardex + usuarios */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="min-w-0">
                    <MovimientosKardex datos={data.movimientos_kardex} />
                </div>
                <div className="min-w-0">
                    <UsuariosResumen datos={data.usuarios_resumen} />
                </div>
            </div>

            {/* Actividad reciente */}
            <ActividadReciente datos={data.actividad_reciente} />

        </div>
    );
};

export default Dashboard;