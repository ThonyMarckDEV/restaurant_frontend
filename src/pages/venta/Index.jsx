import React, { useMemo } from 'react';
import { useIndex } from 'hooks/venta/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import PdfModal from 'components/Shared/Modals/PdfModal';
import TicketDetailModal from './TicketDetailModal'; 

import { 
    BanknotesIcon, 
    TrashIcon, 
    EyeIcon,
    CurrencyDollarIcon,
    CreditCardIcon,
    DevicePhoneMobileIcon,
    PrinterIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, ventas, paginationInfo, filters, alert, setAlert, confirmAction, setConfirmAction,
        fetchVentas, handleAskDelete, handleConfirmAction, handleFilterChange, handleFilterSubmit, handleFilterClear,
        viewDetail, handleOpenViewModal, handleCloseViewModal, handlePrint, isPdfOpen, closePdfModal, pdfUrl
    } = useIndex();

    // ---- CONFIGURACIÓN DE FILTROS ----
    const filterConfig = useMemo(() => [
        { name: 'codigo', type: 'text', label: 'Serie (B001 - F001)', placeholder: 'Ej: B001', colSpan: 'col-span-12 md:col-span-3' },
        { name: 'fecha', type: 'date', label: 'Fecha', colSpan: 'col-span-12 md:col-span-3' },
        {
            name: 'metodo_pago', type: 'select', label: 'Método Pago', colSpan: 'col-span-12 md:col-span-3',
            options: [
                { value: '', label: 'Todos' }, 
                { value: '1', label: 'Efectivo' }, 
                { value: '2', label: 'Tarjeta' }, 
                { value: '3', label: 'Yape/Plin' }
            ] 
        },
        {
            name: 'estado', type: 'select', label: 'Estado', colSpan: 'col-span-12 md:col-span-3',
            options: [
                { value: '', label: 'Todos' }, 
                { value: '1', label: 'Pagado' }, 
                { value: '0', label: 'Anulado' }
            ] 
        }
    ], []);

    // ---- HELPERS VISUALES ----
    const getEstadoBadge = (estado) => {
        return estado ? 
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-emerald-100 uppercase tracking-wide">Pagado</span> : 
            <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-rose-100 uppercase tracking-wide">Anulado</span>;
    };

    const getMetodoPago = (metodo) => {
        const metodos = {
            1: { label: 'Efectivo', icon: CurrencyDollarIcon, cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            2: { label: 'Tarjeta', icon: CreditCardIcon, cls: 'text-blue-600 bg-blue-50 border-blue-100' },
            3: { label: 'Yape/Plin', icon: DevicePhoneMobileIcon, cls: 'text-purple-600 bg-purple-50 border-purple-100' },
        };
        const m = metodos[metodo] || metodos[1];
        return (
            <span className={`flex items-center gap-1 w-max px-2 py-0.5 rounded text-[10px] font-black border uppercase ${m.cls}`}>
                <m.icon className="w-3 h-3" /> {m.label}
            </span>
        );
    };

    // ---- COLUMNAS DE LA TABLA ----
    const columns = useMemo(() => [
        { header: 'Comprobante', render: (row) => <span className="font-black text-slate-900 tracking-wider">{row.codigo}</span> },
        { 
            header: 'Mesa / Pedido', 
            render: (row) => {
                const tieneMesa = row.orden?.mesa?.numero;
                const nombreLlevar = row.orden?.nombre_llevar;

                return (
                    <div className="flex flex-col">
                        <span className={`font-bold ${tieneMesa ? 'text-slate-600' : 'text-amber-600'}`}>
                            {tieneMesa ? `Mesa ${tieneMesa}` : 'Para llevar'}
                        </span>
                        {/* Muestra el nombre del cliente si es para llevar */}
                        {!tieneMesa && nombreLlevar && (
                            <span className="text-[10px] font-bold text-slate-400 italic">
                                {nombreLlevar}
                            </span>
                        )}
                    </div>
                );
            } 
        },
        { 
            header: 'Cliente / Cajero', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 uppercase leading-tight">{row.nombre_cliente}</span>
                    <span className="text-[10px] font-bold text-slate-400 italic">Cajero: {row.nombre_cajero}</span>
                </div>
            ) 
        },
        { header: 'Método', render: (row) => getMetodoPago(row.metodo_pago) },
        { header: 'Total', render: (row) => <span className="font-black text-emerald-600 text-sm">S/ {Number(row.total).toFixed(2)}</span> },
        { header: 'Estado', render: (row) => getEstadoBadge(row.estado) },
        { header: 'Fecha', render: (row) => <span className="text-xs font-bold text-slate-500">{new Date(row.created_at).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}</span> },
        { 
            header: 'Acciones', 
            render: (row) => (
                <div className="flex gap-1">
                    <button onClick={() => handleOpenViewModal(row.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver Ticket">
                        <EyeIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => handlePrint(row.id)} 
                        title="Imprimir Ticket"
                        className="p-2 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <PrinterIcon className="w-5 h-5"/>
                    </button>
                    {row.estado ? (
                        <button onClick={() => handleAskDelete(row.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Anular Venta">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    ) : null}
                </div>
            )
        }
    ], [handleAskDelete, handleOpenViewModal, handlePrint]);

    const getConfirmMessage = () => {
        const ventaSelect = ventas.find(v => v.id === confirmAction.id);
        
        // Si es Salón (tipo 1), mencionamos la mesa
        if (ventaSelect?.orden?.tipo_pedido === 1) {
            return "Se cambiará el estado de la venta a ANULADO, la orden volverá a estado 'Pendiente' y la mesa se marcará como ocupada nuevamente. Esta acción no se puede deshacer.";
        }
        
        // Si es Llevar/Delivery, omitimos lo de la mesa
        return "Se cambiará el estado de la venta a ANULADO y la orden volverá a la cola de pedidos 'Pendientes' para su corrección. Esta acción no se puede deshacer.";
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <PageHeader title="Historial de Ventas" icon={BanknotesIcon} buttonText="Cobrar Orden" buttonLink="/venta/crear" />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <div className="rounded-2xl overflow-hidden ">
                <Table 
                    columns={columns} 
                    data={ventas} 
                    loading={loading} 
                    filterConfig={filterConfig} 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    onFilterSubmit={handleFilterSubmit} 
                    onFilterClear={handleFilterClear} 
                    pagination={{...paginationInfo, onPageChange: fetchVentas}}
                    rowClassName={(row) => !row.estado ? 'opacity-50 grayscale bg-slate-50' : ''} 
                />
            </div>

            <TicketDetailModal 
                isOpen={viewDetail.isOpen} 
                onClose={handleCloseViewModal} 
                data={viewDetail.data}
                isLoading={viewDetail.isLoading}
            />

            {confirmAction.show && (
                <ConfirmModal 
                    title="¿Anular Venta?"
                    message={getConfirmMessage()} 
                    onConfirm={handleConfirmAction} 
                    onCancel={() => setConfirmAction({show: false, id: null, type: ''})} 
                />
            )}

            <PdfModal 
                isOpen={isPdfOpen}
                onClose={closePdfModal}
                title="Ticket de Venta"
                pdfUrl={pdfUrl}
            />
        </div>
    );
};

export default Index;