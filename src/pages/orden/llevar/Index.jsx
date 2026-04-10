import React, { useMemo } from 'react';
import { useIndex } from 'hooks/orden/llevar/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import OrdenViewModal from '../OrdenViewModal';
import PdfModal from 'components/Shared/Modals/PdfModal'; 
import { 
    TrashIcon, 
    EyeIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, ordenes, paginationInfo, filters, alert, setAlert, confirmAction, setConfirmAction,
        fetchOrdenes, handleAskDelete, handleConfirmAction, handleFilterChange, handleFilterSubmit, handleFilterClear,
        viewDetail, handleOpenViewModal, handleCloseViewModal,
        pdfData, setPdfData
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'fecha', type: 'date', label: 'Fecha de Pedido', colSpan: 'col-span-12 md:col-span-6' },
        {
            name: 'estado', type: 'select', label: 'Estado', colSpan: 'col-span-12 md:col-span-6',
            options: [
                { value: '', label: 'Todos' }, 
                { value: '1', label: 'Abierta' }, 
                { value: '2', label: 'Pagada' }, 
                { value: '3', label: 'Anulada' }
            ] 
        }
    ], []);

    const getEstadoBadge = (estado) => {
        const badges = {
            1: <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-black border border-blue-200 uppercase tracking-tighter">Abierta</span>,
            2: <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-black border border-emerald-200 uppercase tracking-tighter">Pagada</span>,
            3: <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-black border border-red-200 uppercase tracking-tighter">Anulada</span>,
        };
        return badges[estado] || badges[1];
    };

    const columns = useMemo(() => [
        { header: 'N° Orden', render: (row) => <span className="font-bold text-slate-900">#{row.id.toString().padStart(6, '0')}</span> },
        
        { 
            header: 'Cliente / Identificador', 
            render: (row) => {
                // Cortito, limpio y directo desde tu Backend optimizado
                const nombreClienteFormat = row.cliente_nombre_completo || row.nombre_llevar || 'Cliente al paso';
                
                return (
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 w-fit">
                        <ShoppingBagIcon className="w-4 h-4" />
                        <span className="font-black uppercase text-xs truncate max-w-[200px]">{nombreClienteFormat}</span>
                    </div>
                );
            } 
        },

        { header: 'Cajero / Mozo', render: (row) => <span className="text-xs font-bold text-slate-600">{row.nombre_mozo}</span> },
        { header: 'Estado', render: (row) => getEstadoBadge(row.estado) },
        { header: 'Fecha y Hora', render: (row) => <span className="text-xs text-slate-500 font-medium">{new Date(row.created_at).toLocaleString('es-PE')}</span> },
        { 
            header: 'Acciones', 
            render: (row) => (
                <div className="flex gap-1">
                    {/* El ojo para ver detalle siempre está disponible */}
                    <button 
                        onClick={() => handleOpenViewModal(row.id)} 
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                        title="Ver Detalle"
                    >
                        <EyeIcon className="w-5 h-5" />
                    </button>

                    {/* LÓGICA DE SEGURIDAD: 
                        Solo permitimos ANULAR si la orden está ABIERTA (1).
                        Si está Pagada (2) u Anulada (3), el botón desaparece. */}
                    {row.estado === 1 && (
                        <button 
                            onClick={() => handleAskDelete(row.id)} 
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" 
                            title="Anular Orden"
                        >
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    )}
                </div>
            )
        }
    ], [handleAskDelete, handleOpenViewModal]);

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <PageHeader title="Órdenes para Llevar" icon={ShoppingBagIcon} buttonText="Nuevo Pedido" buttonLink="/orden/llevar/crear" />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <div className="rounded-2xl overflow-hidden mt-4">
                <Table 
                    columns={columns} 
                    data={ordenes} 
                    loading={loading} 
                    filterConfig={filterConfig} 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    onFilterSubmit={handleFilterSubmit} 
                    onFilterClear={handleFilterClear} 
                    pagination={{...paginationInfo, onPageChange: fetchOrdenes}} 
                />
            </div>
            
            <OrdenViewModal 
                isOpen={viewDetail.isOpen}
                onClose={handleCloseViewModal}
                data={viewDetail.data}
                isLoading={viewDetail.isLoading}
            />
            
            {confirmAction.show && (
                <ConfirmModal 
                    message="¿Estás seguro de ANULAR esta orden para llevar? Esta acción no se puede deshacer y se generará un ticket de anulación para cocina."
                    onConfirm={handleConfirmAction} 
                    onCancel={() => setConfirmAction({show: false, id: null, type: ''})} 
                />
            )}

            <PdfModal 
                isOpen={pdfData.isOpen}
                onClose={() => setPdfData({ isOpen: false, url: null })}
                title="Imprimir Anulación (Cocina)"
                pdfUrl={pdfData.url}
            />
        </div>
    );
};

export default Index;