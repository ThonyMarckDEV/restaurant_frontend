import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/almacen/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { 
    HomeModernIcon, PencilSquareIcon, TrashIcon, EyeIcon
} from '@heroicons/react/24/outline';

const TIPOS_CONFIG = {
    1: { label: 'Principal', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    2: { label: 'Secundario', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    3: { label: 'Producción', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    4: { label: 'Venta', color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

const Index = () => {
    const {
        loading, almacenes, paginationInfo, filters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, confirmAction, setConfirmAction,
        fetchAlmacenes, handleView, handleAskStatus, handleAskDelete, handleConfirmAction,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar Almacén', placeholder: 'Nombre...', colSpan: 'col-span-12 md:col-span-4' },
        {
            name: 'tipo', type: 'select', label: 'Tipo', colSpan: 'col-span-12 md:col-span-4',
            options: [
                { value: '', label: 'Todos los tipos' },
                { value: '1', label: 'Principal' },
                { value: '2', label: 'Secundario' },
                { value: '3', label: 'Producción' },
                { value: '4', label: 'Venta' },
            ]
        },
        {
            name: 'estado', type: 'select', label: 'Estado', colSpan: 'col-span-12 md:col-span-4',
            options: [
                { value: '', label: 'Todos' }, { value: '1', label: 'Activos' }, { value: '0', label: 'Inactivos' }
            ] 
        }
    ], []);

    const columns = useMemo(() => [
        { 
            header: 'Almacén', 
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                        <HomeModernIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm uppercase">{row.nombre}</span>
                </div>
            )
        },
        {
            header: 'Tipo',
            render: (row) => {
                const config = TIPOS_CONFIG[row.tipo] || TIPOS_CONFIG[2];
                // 🔥 Renderizamos solo el texto, sin intentar cargar un componente icono
                return (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${config.color}`}>
                        {config.label}
                    </span>
                );
            }
        },
        { 
            header: 'Estado', 
            render: (row) => (
                <button 
                    onClick={() => handleAskStatus(row.id)} 
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all shadow-sm ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                >
                    {row.estado ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
        { 
            header: 'Acciones', 
            render: (row) => (
                <div className="flex gap-1">
                    <button onClick={() => handleView(row.id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Ver Detalle">
                        <EyeIcon className="w-5 h-5"/>
                    </button>
                    <Link to={`/almacen/editar/${row.id}`} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all" title="Editar">
                        <PencilSquareIcon className="w-5 h-5"/>
                    </Link>
                    <button onClick={() => handleAskDelete(row.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
            )
        }
    ], [handleAskStatus, handleView, handleAskDelete]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Gestión de Almacenes" icon={HomeModernIcon} buttonText="+ Nuevo Almacén" buttonLink="/almacen/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <Table columns={columns} data={almacenes} loading={loading} filterConfig={filterConfig} filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear} pagination={{...paginationInfo, onPageChange: fetchAlmacenes}} />
            
            {confirmAction.show && (
                <ConfirmModal 
                    message={confirmAction.type === 'delete' ? "¿Eliminar este almacén?" : "¿Cambiar estado?"} 
                    onConfirm={handleConfirmAction} 
                    onCancel={() => setConfirmAction({show: false, id: null, type: ''})} 
                />
            )}
            
            <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Detalle" isLoading={viewLoading}>
                {viewData && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase">Nombre</p>
                            <p className="text-xl font-black text-slate-800 uppercase leading-tight">{viewData.nombre}</p>
                        </div>
                        <div className="flex justify-center">
                            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase border ${TIPOS_CONFIG[viewData.tipo]?.color}`}>
                                {TIPOS_CONFIG[viewData.tipo]?.label}
                            </span>
                        </div>
                    </div>
                )}
            </ViewModal>
        </div>
    );
};

export default Index;