import React, { useMemo } from 'react';
import { useIndex } from 'hooks/traspaso/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ViewModal from 'components/Shared/Modals/ViewModal';
import PdfModal from 'components/Shared/Modals/PdfModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import AlmacenSearchSelect from 'components/Shared/Comboboxes/AlmacenSearchSelect';
import { 
    ArrowsRightLeftIcon, 
    EyeIcon, 
    TrashIcon, 
    CalendarIcon,
    IdentificationIcon,
    PrinterIcon,
    XCircleIcon 
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, traspasos, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, isConfirmOpen, setIsConfirmOpen,
        isPdfOpen, pdfUrl, closePdfModal, handlePrint, 
        fetchTraspasos, handleView, handleDelete, openConfirmAnular, 
        handleFilterChange, handleFilterSubmit, handleFilterClear,
        canCancel
    } = useIndex();

    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Código Traspaso', 
            placeholder: 'Ej: T001-00000001', 
            colSpan: 'col-span-12 md:col-span-2' 
        },
        {
            name: 'almacen_origen_id', 
            type: 'custom', 
            label: 'Almacén Origen', 
            colSpan: 'col-span-12 md:col-span-3',
            render: () => (
                <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-1">Almacén Origen</label>
                    <AlmacenSearchSelect 
                        isFilter={true} 
                        form={filters} 
                        setForm={setFilters} 
                        fieldId="almacen_origen_id" 
                        fieldNombre="almacen_origen_nombre" 
                    />
                </div>
            )
        },
        {
            name: 'almacen_destino_id', 
            type: 'custom', 
            label: 'Almacén Destino', 
            colSpan: 'col-span-12 md:col-span-3',
            render: () => (
                <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-1">Almacén Destino</label>
                    <AlmacenSearchSelect 
                        isFilter={true} 
                        form={filters} 
                        setForm={setFilters} 
                        fieldId="almacen_destino_id" 
                        fieldNombre="almacen_destino_nombre" 
                    />
                </div>
            )
        },
        { 
            name: 'estado', 
            type: 'select', 
            label: 'Estado', 
            options: [
                { value: '', label: 'Todos' },
                { value: '1', label: 'Completados' },
                { value: '0', label: 'Anulados' }
            ],
            colSpan: 'col-span-12 md:col-span-2' 
        }
    ], [filters, setFilters]);

    const columns = useMemo(() => [
        { 
            header: 'Código', 
            render: (row) => (
                <div className="flex items-center gap-2">
                    <IdentificationIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-black text-blue-600 tracking-wider uppercase text-xs">{row.codigo}</span>
                </div>
            ) 
        },
        { 
            header: 'Fecha', 
            render: (row) => (
                <div className="flex items-center gap-2 text-slate-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">{new Date(row.created_at).toLocaleDateString('es-PE')}</span>
                </div>
            )
        },
        { 
            header: 'Ruta del Movimiento', 
            render: (row) => (
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {row.origen?.nombre}
                    </span>
                    <ArrowsRightLeftIcon className="w-4 h-4 text-slate-300" />
                    <span className="text-[10px] font-black text-slate-800 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {row.destino?.nombre}
                    </span>
                </div>
            )
        },
        { 
            header: 'Estado', 
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase border ${
                    row.estado 
                    ? 'bg-green-50 text-green-600 border-green-100' 
                    : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                    {row.estado ? 'Completado' : 'Anulado'}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => handleView(row.id)} 
                        title="Ver detalle"
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <EyeIcon className="w-5 h-5"/>
                    </button>

                    <button 
                        onClick={() => handlePrint(row.id)} 
                        title="Imprimir Ticket"
                        className="p-2 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <PrinterIcon className="w-5 h-5"/>
                    </button>

                    {row.estado === 1 && (
                        canCancel(row.created_at) ? (
                            <button 
                                onClick={() => openConfirmAnular(row.id)} 
                                title="Anular Traspaso"
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        ) : (
                            <div className="p-2 cursor-help" title="Plazo de anulación vencido (24h)">
                                <XCircleIcon className="w-5 h-5 text-slate-300" />
                            </div>
                        )
                    )}
                </div>
            )
        }
    ], [handleView, handlePrint, openConfirmAnular, canCancel]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Historial de Traspasos" 
                subtitle="Gestión de movimientos internos de mercadería"
                icon={ArrowsRightLeftIcon} 
                buttonText="+ Nuevo Traspaso" 
                buttonLink="/traspaso/crear" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={traspasos} 
                loading={loading} 
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{...paginationInfo, onPageChange: fetchTraspasos}} 
                rowClassName={(row) => !row.estado ? 'opacity-50 grayscale bg-slate-50 font-medium' : ''}
            />

            <PdfModal 
                isOpen={isPdfOpen}
                onClose={closePdfModal}
                title="Ticket de Traspaso"
                pdfUrl={pdfUrl}
            />

            <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Detalle del Traspaso" isLoading={viewLoading} size="max-w-2xl">
                {viewData && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Desde (Origen)</p>
                                <p className="text-sm font-bold text-slate-600 uppercase">{viewData.origen?.nombre}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Hacia (Destino)</p>
                                <p className="text-sm font-bold text-slate-800 uppercase">{viewData.destino?.nombre}</p>
                             </div>
                             <div className="col-span-2 border-t pt-2 mt-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Observaciones</p>
                                <p className="text-xs text-slate-500 italic">{viewData.observacion || 'Sin observaciones registradas.'}</p>
                             </div>
                        </div>

                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-800 text-white uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3">Ítem / Insumo</th>
                                        <th className="p-3 text-center">Cantidad Traspasada</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {viewData.detalles?.map(d => (
                                        <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 font-bold uppercase text-slate-700">{d.insumo?.nombre}</td>
                                            <td className="p-3 text-center">
                                                <span className="font-black text-sm text-slate-900">{Number(d.cantidad)}</span>
                                                <span className="ml-1 text-[10px] font-bold text-slate-400 uppercase">{d.insumo?.unidad_medida?.abreviatura}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </ViewModal>

            {isConfirmOpen && (
                <ConfirmModal 
                    title="¿Anular este traspaso?" 
                    message="Se revertirá el stock restando del destino y sumando nuevamente al origen. Esta acción quedará registrada en el Kardex y no se puede deshacer."
                    onConfirm={handleDelete} 
                    onCancel={() => setIsConfirmOpen(false)} 
                    confirmText="Sí, anular movimiento"
                    cancelText="No, mantener"
                />
            )}
        </div>
    );
};

export default Index;