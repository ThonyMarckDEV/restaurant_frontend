import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/caja/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { CubeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, records, paginationInfo, filters, alert, setAlert,
        confirmAction, setConfirmAction, fetchRecords, handleAskStatus, handleAskDelete,
        handleConfirmAction, handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar', placeholder: 'Buscar...', colSpan: 'col-span-12 md:col-span-6' }
    ], []);

    const columns = useMemo(() => [

        {
            header: 'NOMBRE',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                        <CubeIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm uppercase">{row.nombre}</span>
                </div>
            )
        },
        {
            header: 'DESCRIPCION',
            render: (row) => <span className="text-xs text-slate-600">{row.descripcion || '---'}</span>
        },
        {
            header: 'Estado',
            render: (row) => {
                const isActive = row.activo; 
                return (
                    <button 
                        onClick={() => handleAskStatus(row.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 shadow-sm transition-transform
                            ${isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                    >
                        {isActive ? 'Activo' : 'Inactivo'}
                    </button>
                );
            }
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex gap-2">
                    <Link to={`/caja/editar/${row.id}`} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleAskDelete(row.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }

    ], [handleAskStatus, handleAskDelete]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title={`Gestión de Cajas`} icon={CubeIcon} buttonText={`+ Nueva Caja`} buttonLink={`/caja/agregar`} />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            <Table columns={columns} data={records} loading={loading} filterConfig={filterConfig} filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear} pagination={{ ...paginationInfo, onPageChange: fetchRecords }} />

            {confirmAction.show && (
                <ConfirmModal 
                    message={confirmAction.type === 'delete' ? "¿Seguro que deseas eliminar este registro?" : "¿Deseas cambiar el estado de este registro?"}
                    onConfirm={handleConfirmAction} 
                    onCancel={() => setConfirmAction({show: false, id: null, type: ''})} 
                />
            )}
        </div>
    );
};

export default Index;