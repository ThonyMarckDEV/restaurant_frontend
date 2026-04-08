import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/menuOpcion/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import MenuSearchSelect from 'components/Shared/Comboboxes/MenuSearchSelect';
import { ListBulletIcon, PencilSquareIcon, TrashIcon, TagIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, opciones, paginationInfo, filters, setFilters, alert, setAlert,
        confirmAction, setConfirmAction, fetchOpciones, handleAskStatus, handleAskDelete, 
        handleConfirmAction, handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        {
            name: 'menu_id', type: 'custom', label: 'Filtrar por Menú', colSpan: 'col-span-12 md:col-span-4',
            render: () => <MenuSearchSelect isFilter={true} form={filters} setForm={setFilters} fieldId="menu_id" fieldNombre="menu_nombre" />
        },
        {
            name: 'disponible', type: 'select', label: 'Disponibilidad', colSpan: 'col-span-12 md:col-span-4',
            options: [{ value: '', label: 'Todos' }, { value: 'true', label: 'Disponibles' }, { value: 'false', label: 'Agotados' }] 
        }
    ], [filters, setFilters]);

    const columns = useMemo(() => [
        { 
            header: 'Menú Principal', 
            render: (row) => (
                <div className="flex items-center gap-2">
                    <BookOpenIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-black text-slate-800 text-xs uppercase tracking-wide">{row.menu?.nombre}</span>
                </div>
            )
        },
        { 
            header: 'Plato Ofrecido', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm uppercase">{row.plato?.nombre}</span>
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded w-max mt-0.5 border border-blue-100 flex items-center gap-1">
                        <TagIcon className="w-3 h-3"/> {row.plato?.categoria?.nombre}
                    </span>
                </div>
            )
        },
        { 
            header: 'Disponibilidad', 
            render: (row) => (
                <button 
                    onClick={() => handleAskStatus(row.id)} 
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-all shadow-sm
                        ${row.disponible ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                >
                    {row.disponible ? 'Apto (Stock)' : 'Agotado'}
                </button>
            )
        },
        { 
            header: 'Acciones', 
            render: (row) => (
                <div className="flex gap-2">
                    <Link to={`/menu-opcion/editar/${row.id}`} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all" title="Editar">
                        <PencilSquareIcon className="w-5 h-5"/>
                    </Link>
                    <button onClick={() => handleAskDelete(row.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Quitar del menú">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
            )
        }
    ], [handleAskStatus, handleAskDelete]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Opciones de Menú" subtitle="Asigna qué platos componen cada menú" icon={ListBulletIcon} buttonText="+ Asignar Plato a Menú" buttonLink="/menu-opcion/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <Table columns={columns} data={opciones} loading={loading} filterConfig={filterConfig} filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear} pagination={{...paginationInfo, onPageChange: fetchOpciones}} />
            {confirmAction.show && (
                <ConfirmModal 
                    message={confirmAction.type === 'delete' ? "¿Seguro de quitar este plato del menú?" : "¿Deseas cambiar la disponibilidad de este plato?"} 
                    onConfirm={handleConfirmAction} 
                    onCancel={() => setConfirmAction({show: false, id: null, type: ''})} 
                />
            )}
        </div>
    );
};

export default Index;