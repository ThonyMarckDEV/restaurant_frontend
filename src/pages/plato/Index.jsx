import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/plato/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import ViewModal from 'components/Shared/Modals/ViewModal';
import CategoriaPlatoSearchSelect from 'components/Shared/Comboboxes/CategoriaPlatoSearchSelect';
import { 
    FireIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    EyeIcon, 
    TagIcon,
    BookOpenIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, platos, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, confirmAction, setConfirmAction,
        fetchPlatos, handleView, handleAskStatus, handleAskDelete, handleConfirmAction,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Buscar Plato', 
            placeholder: 'Ej: Chaufa...', 
            colSpan: 'col-span-12 md:col-span-3' 
        },
        {
            name: 'categoria_id',
            type: 'custom',
            label: 'Categoría',
            colSpan: 'col-span-12 md:col-span-3',
            render: () => (
                <CategoriaPlatoSearchSelect 
                    isFilter={true} 
                    form={filters} 
                    setForm={setFilters} 
                    fieldId="categoria_id"
                    fieldNombre="categoria_nombre"
                />
            )
        },
        {
            name: 'es_para_menu', 
            type: 'select', 
            label: 'Tipo', 
            colSpan: 'col-span-12 md:col-span-3',
            options: [
                { value: '', label: 'Todos' }, 
                { value: 'true', label: 'Menú' }, 
                { value: 'false', label: 'Solo Carta' }
            ] 
        },
        {
            name: 'estado', 
            type: 'select', 
            label: 'Estado', 
            colSpan: 'col-span-12 md:col-span-3',
            options: [
                { value: '', label: 'Todos' }, 
                { value: '1', label: 'Activos' }, 
                { value: '0', label: 'Inactivos' }
            ] 
        }
    ], [filters, setFilters]);

    const columns = useMemo(() => [
        {
            header: 'Plato',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                        <FireIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm uppercase">{row.nombre}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider flex items-center gap-1">
                                <TagIcon className="w-3 h-3" /> {row.categoria?.nombre}
                            </span>
                            {row.es_para_menu ? (
                                <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider flex items-center gap-1 border border-purple-200">
                                    <BookOpenIcon className="w-3 h-3"/> Menú
                                </span>
                            ) : (
                                <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider flex items-center gap-1 border border-amber-200">
                                    <DocumentTextIcon className="w-3 h-3"/> Solo Carta
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Precio Carta',
            render: (row) => (
                <span className="font-black text-green-700 text-sm">
                    S/ {parseFloat(row.precio_carta).toFixed(2)}
                </span>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => handleAskStatus(row.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-transform shadow-sm
                        ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                >
                    {row.estado ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => handleView(row.id)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all" title="Ver Detalle">
                        <EyeIcon className="w-5 h-5" />
                    </button>
                    <Link to={`/plato/editar/${row.id}`} className="p-2 text-slate-500 hover:text-black hover:bg-slate-50 rounded-lg transition-all" title="Editar">
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleAskDelete(row.id)} className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ], [handleAskStatus, handleView, handleAskDelete]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Gestión de Platos" icon={FireIcon} buttonText="+ Nuevo Plato" buttonLink="/plato/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <Table columns={columns} data={platos} loading={loading} filterConfig={filterConfig} filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear} pagination={{ ...paginationInfo, onPageChange: fetchPlatos }} />

            {confirmAction.show && (
                <ConfirmModal 
                    message={confirmAction.type === 'delete' 
                        ? "¿Estás seguro de eliminar este plato? No se podrá borrar si ya tiene ventas registradas." 
                        : "¿Deseas cambiar el estado de este plato?"}
                    onConfirm={handleConfirmAction} 
                    onCancel={() => setConfirmAction({show: false, id: null, type: ''})} 
                />
            )}

            <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Ficha del Plato" isLoading={viewLoading}>
                {viewData && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-100 p-3 rounded-full">
                                    <FireIcon className="w-8 h-8 text-slate-500" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <TagIcon className="w-3 h-3"/> {viewData.categoria?.nombre}
                                    </h4>
                                    <p className="text-xl font-black text-slate-800 uppercase">{viewData.nombre}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Precio a la Carta</h4>
                                <p className="text-xl font-black text-green-600">S/ {parseFloat(viewData.precio_carta).toFixed(2)}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Disponibilidad en Menú</h4>
                                <p className="text-sm font-bold text-slate-700">
                                    {viewData.es_para_menu ? 'Puede incluirse en menú' : 'Solo a la carta'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </ViewModal>
        </div>
    );
};

export default Index;