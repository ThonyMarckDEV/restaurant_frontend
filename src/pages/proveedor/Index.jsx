import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/proveedor/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import ViewModal from 'components/Shared/Modals/ViewModal';

import { 
    BuildingOfficeIcon, 
    PencilSquareIcon, 
    IdentificationIcon,
    UserIcon,
    EyeIcon,
    PhoneIcon,
    EnvelopeIcon, 
    MapPinIcon 
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, proveedores, paginationInfo, filters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, handleView,
        showConfirm, setShowConfirm, setIdToToggle, fetchProveedores, 
        handleAskToggle, handleConfirmToggle, handleFilterChange, 
        handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Buscar Proveedor', 
            placeholder: 'Ej: RUC, Razón Social...', 
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
            header: 'Empresa',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                        <BuildingOfficeIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{row.razon_social}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <IdentificationIcon className="w-3 h-3"/> RUC: {row.ruc}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Contacto',
            render: (row) => (
                <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
                    <UserIcon className="w-4 h-4 text-slate-400"/> {row.nombre_contacto || 'Sin contacto'}
                </span>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => handleAskToggle(row.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-transform shadow-sm
                        ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                    title="Clic para cambiar estado"
                >
                    {row.estado ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleView(row.id)}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                        title="Ver Detalle"
                    >
                        <EyeIcon className="w-5 h-5" />
                    </button>
                    <Link 
                        to={`/proveedor/editar/${row.id}`} 
                        className="p-2 text-slate-500 hover:text-black hover:bg-slate-50 rounded-lg transition-all" 
                        title="Editar Proveedor"
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                </div>
            )
        }
    ], [handleAskToggle, handleView]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Gestión de Proveedores" 
                icon={BuildingOfficeIcon} 
                buttonText="+ Nuevo Proveedor" 
                buttonLink="/proveedor/agregar" 
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns}
                data={proveedores}
                loading={loading}
                filterConfig={filterConfig} 
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{
                    ...paginationInfo,
                    onPageChange: fetchProveedores
                }}
            />

            {showConfirm && (
                <ConfirmModal 
                    message="¿Estás seguro de cambiar el estado de este proveedor? Si lo inactivas, no podrás registrarle nuevas compras."
                    confirmText="Sí, cambiar"
                    cancelText="Cancelar"
                    onConfirm={handleConfirmToggle}
                    onCancel={() => { setShowConfirm(false); setIdToToggle(null); }}
                />
            )}

            {/* <-- MODAL DE DETALLE --> */}
            <ViewModal 
                isOpen={isViewOpen} 
                onClose={() => setIsViewOpen(false)} 
                title="Ficha del Proveedor"
                isLoading={viewLoading}
            >
                {viewData && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-6">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shrink-0">
                                <BuildingOfficeIcon className="w-8 h-8 text-slate-400"/>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Razón Social</h4>
                                <p className="text-gray-800 font-black text-xl leading-tight">
                                    {viewData.razon_social}
                                </p>
                                <div className="flex flex-wrap gap-3 mt-3">
                                    <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                        <IdentificationIcon className="w-4 h-4 text-gray-400"/> RUC: {viewData.ruc}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Contacto</h4>
                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                    <UserIcon className="w-4 h-4 text-gray-400"/> {viewData.nombre_contacto || 'No registrado'}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Teléfono</h4>
                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                    <PhoneIcon className="w-4 h-4 text-gray-400"/> {viewData.telefono || 'No registrado'}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Correo Electrónico</h4>
                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                    <EnvelopeIcon className="w-4 h-4 text-gray-400"/> {viewData.correo || 'No registrado'}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Dirección</h4>
                                <div className="flex items-start gap-2 text-gray-800 font-medium">
                                    <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"/>
                                    {viewData.direccion || 'No registrada'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </ViewModal>
        </div>
    );
};

export default Index;