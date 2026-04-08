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
import {
    ChartBarIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';

const PERIODOS = [
    { key: 'hoy',    label: 'Hoy' },
    { key: 'semana', label: 'Semana' },
    { key: 'mes',    label: 'Mes' },
    { key: 'año',    label: 'Año' },
];

const Dashboard = () => {
    const { data, loading, error, periodo, cambiarPeriodo, recargar } = useDashboard();

    if (loading) return <LoadingScreen />;
    if (error)   return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-red-500 font-semibold">{error}</p>
        </div>
    );

    return (
        <div className="p-4 md:p-6 min-h-screen space-y-6">

            {/* Cabecera */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <ChartBarIcon className="w-7 h-7 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
                            Panel de Control
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            Resumen general del negocio
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Selector de período */}
                    <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                        {PERIODOS.map(p => (
                            <button
                                key={p.key}
                                onClick={() => cambiarPeriodo(p.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${
                                    periodo === p.key
                                        ? 'bg-white text-slate-800 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Botón recargar */}
                    <button
                        onClick={recargar}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                        title="Recargar datos"
                    >
                        <ArrowPathIcon className="w-4 h-4 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <KpiCards kpis={data.kpis} />

            {/* Fila: ventas por día + método de pago */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                    <VentasPorDiaChart datos={data.ventas_por_dia} />
                </div>
                <div>
                    <MetodoPagoChart datos={data.ventas_por_metodo} />
                </div>
            </div>

            {/* Fila: top productos + órdenes por tipo */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                    <TopProductos datos={data.top_productos} />
                </div>
                <div>
                    <OrdenesTipoChart datos={data.ordenes_por_tipo} />
                </div>
            </div>

            {/* Fila: kardex + usuarios */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <MovimientosKardex datos={data.movimientos_kardex} />
                <UsuariosResumen datos={data.usuarios_resumen} />
            </div>

            {/* Actividad reciente */}
            <ActividadReciente datos={data.actividad_reciente} />

        </div>
    );
};

export default Dashboard;