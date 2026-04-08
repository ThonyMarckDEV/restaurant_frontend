import React, { useMemo } from 'react';
import { useIndex } from 'hooks/cajaSesion/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import DetalleMovimientosModal from './DetalleMovimientosModal';
import { ArchiveBoxIcon, EyeIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, sesiones, paginationInfo, filters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading,
        fetchSesiones, handleView, handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'fecha', type: 'date', label: 'Fecha de Apertura', colSpan: 'col-span-12 md:col-span-6' },
        {
            name: 'estado', type: 'select', label: 'Estado', colSpan: 'col-span-12 md:col-span-6',
            options: [ { value: '', label: 'Todos' }, { value: '1', label: 'Abierta' }, { value: '2', label: 'Cerrada' } ] 
        }
    ], []);

    const columns = useMemo(() => [
        {
            header: 'Turno',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-xs uppercase">{row.caja?.nombre}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Cajero: {row.usuario?.datos_empleado?.nombre || 'Admin'}</span>
                </div>
            )
        },
        {
            header: 'Fechas',
            render: (row) => (
                <div className="flex flex-col text-[12px] text-slate-600">
                    <span><strong className="text-slate-400">Abierto:</strong> {new Date(row.fecha_apertura).toLocaleString()}</span>
                    <span><strong className="text-slate-400">Cerrado:</strong> {row.fecha_cierre ? new Date(row.fecha_cierre).toLocaleString() : '---'}</span>
                </div>
            )
        },
        {
            header: 'Saldos (S/)',
            render: (row) => (
                <div className="flex flex-col text-xs">
                    <span>Apertura: <strong className="text-slate-700">{row.monto_apertura}</strong></span>
                    {row.estado === 2 && (
                        <>
                            <span>Cierre: <strong className="text-blue-600">{row.monto_cierre}</strong></span>
                            <span>Físico: <strong className="text-emerald-600">{row.monto_real}</strong></span>
                        </>
                    )}
                </div>
            )
        },
        {
            header: 'Diferencia',
            render: (row) => {
                if (row.estado === 1) return <span className="text-xs text-slate-400">En curso</span>;
                const dif = parseFloat(row.diferencia);
                return (
                    <span className={`text-xs font-black p-1 rounded ${dif < 0 ? 'bg-red-100 text-red-600' : dif > 0 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {dif === 0 ? 'CUADRADO' : dif < 0 ? `FALTA S/${Math.abs(dif).toFixed(2)}` : `SOBRA S/${dif.toFixed(2)}`}
                    </span>
                );
            }
        },
        {
            header: 'Estado',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${row.estado === 1 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                    {row.estado === 1 ? 'Abierta' : 'Cerrada'}
                </span>
            )
        },
        {
            header: 'Movimientos',
            render: (row) => (
                <button onClick={() => handleView(row.id)} className="p-2 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors" title="Ver Movimientos">
                    <EyeIcon className="w-5 h-5" />
                </button>
            )
        }
    ], [handleView]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Historial de Turnos de Caja" icon={ArchiveBoxIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            <Table columns={columns} data={sesiones} loading={loading} filterConfig={filterConfig} filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear} pagination={{ ...paginationInfo, onPageChange: fetchSesiones }} />

            {/* Modal de Detalle de Movimientos Separado */}
            <DetalleMovimientosModal 
                isOpen={isViewOpen} 
                onClose={() => setIsViewOpen(false)} 
                viewData={viewData} 
                viewLoading={viewLoading} 
            />
        </div>
    );
};

export default Index;