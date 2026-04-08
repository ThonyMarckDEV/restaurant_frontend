import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/mesa/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { MapIcon, PencilSquareIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, mesas, paginationInfo, filters, alert, setAlert,
        confirmAction, setConfirmAction, fetchMesas, handleAskStatus, handleAskDelete, 
        handleConfirmAction, handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar Mesa', placeholder: 'Ej: Mesa 01...', colSpan: 'col-span-12 md:col-span-4' },
        {
            name: 'activo', type: 'select', label: 'Condición del Sistema', colSpan: 'col-span-12 md:col-span-3',
            options: [{ value: '', label: 'Todas' }, { value: '1', label: 'Habilitadas' }, { value: '0', label: 'Inhabilitadas/Guardadas' }] 
        },
        {
            name: 'estado', type: 'select', label: 'Estado (POS)', colSpan: 'col-span-12 md:col-span-3',
            options: [{ value: '', label: 'Cualquiera' }, { value: '1', label: 'Libre' }, { value: '2', label: 'Ocupada' }] 
        }
    ], []);

    const columns = useMemo(() => [
        { 
            header: 'Mesa', 
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                        <MapIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-black text-slate-800 text-sm uppercase">{row.numero}</span>
                </div>
            )
        },
        {
            header: 'Capacidad',
            render: (row) => (
                <span className="font-bold text-slate-600 flex items-center gap-1 text-sm">
                    <UsersIcon className="w-4 h-4"/> {row.capacidad} pax
                </span>
            )
        },
        { 
            header: 'En Sistema', 
            render: (row) => (
                <button 
                    onClick={() => handleAskStatus(row.id)} 
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase hover:scale-105 transition-all shadow-sm
                        ${row.activo ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                    title="Click para Habilitar/Inhabilitar"
                >
                    {row.activo ? 'Habilitada' : 'Inhabilitada'}
                </button>
            )
        },
        { 
            header: 'En Salón (POS)', 
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm
                    ${row.estado === 1 ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                      row.estado === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                      'bg-slate-100 text-slate-600 border border-slate-200'}`}
                >
                    {row.estado === 1 ? 'Libre' : row.estado === 2 ? 'Ocupada' : 'Desconocido'}
                </span>
            )
        },
        { 
            header: 'Acciones', 
            render: (row) => (
                <div className="flex gap-2">
                    <Link to={`/mesa/editar/${row.id}`} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all" title="Editar / Ubicar">
                        <PencilSquareIcon className="w-5 h-5"/>
                    </Link>
                    <button onClick={() => handleAskDelete(row.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
            )
        }
    ], [handleAskStatus, handleAskDelete]);

    return (
        <div className="container mx-auto p-4 md:p-6">
            <PageHeader title="Gestión de Mesas" subtitle="Crea y ubica las mesas en el salón" icon={MapIcon} buttonText="+ Nueva Mesa" buttonLink="/mesa/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <Table columns={columns} data={mesas} loading={loading} filterConfig={filterConfig} filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear} pagination={{...paginationInfo, onPageChange: fetchMesas}} />
            
            {confirmAction.show && (
                <ConfirmModal 
                    message={confirmAction.type === 'delete' ? "¿Estás seguro de eliminar esta mesa del sistema?" : "¿Deseas habilitar/inhabilitar esta mesa en el salón?"} 
                    onConfirm={handleConfirmAction} 
                    onCancel={() => setConfirmAction({show: false, id: null, type: ''})} 
                />
            )}
        </div>
    );
};

export default Index;