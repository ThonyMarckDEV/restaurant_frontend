import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/unidadMedida/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

import { 
    ScaleIcon, 
    PencilSquareIcon, 
    TrashIcon,
    TagIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, unidades, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, setIdToDelete, fetchUnidades, 
        handleAskDelete, handleConfirmDelete, handleFilterChange, 
        handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Buscar unidad', 
            placeholder: 'Ej: Kilogramo, kg...', 
            colSpan: 'col-span-12 md:col-span-6' 
        }
    ], []);

    const columns = useMemo(() => [
        {
            header: 'Nombre de la Unidad',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                        <ScaleIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">{row.nombre}</span>
                </div>
            )
        },
        {
            header: 'Abreviatura',
            render: (row) => (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                    <TagIcon className="w-3 h-3"/> {row.abreviatura}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Link 
                        to={`/unidad-medida/editar/${row.id}`} 
                        className="p-2 text-slate-500 hover:text-black hover:bg-slate-50 rounded-lg transition-all" 
                        title="Editar Unidad"
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button 
                        onClick={() => handleAskDelete(row.id)}
                        className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar Unidad"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ], [handleAskDelete]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Unidades de Medida" 
                icon={ScaleIcon} 
                buttonText="+ Nueva Unidad" 
                buttonLink="/unidad-medida/agregar" 
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns}
                data={unidades}
                loading={loading}
                filterConfig={filterConfig} 
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{
                    ...paginationInfo,
                    onPageChange: fetchUnidades
                }}
            />

            {showConfirm && (
                <ConfirmModal 
                    message="¿Estás seguro de que deseas eliminar esta unidad de medida? Si está en uso en algún insumo, la operación será cancelada por seguridad."
                    confirmText="Sí, eliminar"
                    cancelText="Cancelar"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => { setShowConfirm(false); setIdToDelete(null); }}
                />
            )}
        </div>
    );
};

export default Index;