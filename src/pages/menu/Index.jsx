import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/menu/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { 
    BookOpenIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    EyeIcon 
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, menus, paginationInfo, filters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, confirmAction, setConfirmAction,
        fetchMenus, handleView, handleAskStatus, handleAskDelete, handleConfirmAction,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Buscar Menú', 
            placeholder: 'Ej: Menú Ejecutivo...', 
            colSpan: 'col-span-12 md:col-span-6' 
        },
        {
            name: 'estado', 
            type: 'select', 
            label: 'Estado', 
            colSpan: 'col-span-12 md:col-span-6',
            options: [
                { value: '', label: 'Todos' }, 
                { value: '1', label: 'Activos' }, 
                { value: '0', label: 'Inactivos' }
            ] 
        }
    ], []);

    const columns = useMemo(() => [
        { 
            header: 'Tipo de Menú', 
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                        <BookOpenIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm uppercase">{row.nombre}</span>
                </div>
            )
        },
        {
            header: 'Precio Fijo',
            render: (row) => (
                <span className="font-black text-green-700 text-sm">
                    S/ {parseFloat(row.precio).toFixed(2)}
                </span>
            )
        },
        { 
            header: 'Estado', 
            render: (row) => (
                <button 
                    onClick={() => handleAskStatus(row.id)} 
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-all shadow-sm
                        ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                >
                    {row.estado ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
        { 
            header: 'Acciones', 
            render: (row) => (
                <div className="flex gap-2">
                    <button onClick={() => handleView(row.id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Ver Detalle">
                        <EyeIcon className="w-5 h-5"/>
                    </button>
                    <Link to={`/menu/editar/${row.id}`} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all" title="Editar">
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
            <PageHeader 
                title="Gestión de Menús" 
                subtitle="Configura los combos o menús del día y sus precios fijos"
                icon={BookOpenIcon} 
                buttonText="+ Nuevo Menú" 
                buttonLink="/menu/agregar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={menus} 
                loading={loading} 
                filterConfig={filterConfig}
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onFilterSubmit={handleFilterSubmit} 
                onFilterClear={handleFilterClear} 
                pagination={{...paginationInfo, onPageChange: fetchMenus}} 
            />
            
            {confirmAction.show && (
                <ConfirmModal 
                    message={confirmAction.type === 'delete' 
                        ? "¿Estás seguro de eliminar este menú? No podrá eliminarse si está registrado en alguna venta." 
                        : "¿Deseas cambiar el estado de este menú?"} 
                    onConfirm={handleConfirmAction} 
                    onCancel={() => setConfirmAction({show: false, id: null, type: ''})} 
                />
            )}
            
            <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Detalle del Menú" isLoading={viewLoading}>
                {viewData && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-100 p-3 rounded-full">
                                    <BookOpenIcon className="w-8 h-8 text-slate-500" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo de Menú</h4>
                                    <p className="text-xl font-black text-slate-800 uppercase leading-tight">{viewData.nombre}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-xs">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Precio Fijo</h4>
                            <p className="text-xl font-black text-green-600">S/ {parseFloat(viewData.precio).toFixed(2)}</p>
                        </div>
                    </div>
                )}
            </ViewModal>
        </div>
    );
};

export default Index;