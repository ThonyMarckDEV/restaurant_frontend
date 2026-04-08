import React, { useMemo } from 'react';
import { useIndex } from 'hooks/salida/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ViewModal from 'components/Shared/Modals/ViewModal';
import PdfModal from 'components/Shared/Modals/PdfModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import AlmacenSearchSelect from 'components/Shared/Comboboxes/AlmacenSearchSelect';
import { 
    ArrowUpRightIcon, 
    EyeIcon, 
    TrashIcon, 
    PrinterIcon, 
    XCircleIcon,
    CalendarIcon 
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, salidas, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, isConfirmOpen, setIsConfirmOpen,
        isPdfOpen, pdfUrl, closePdfModal, handlePrint,
        fetchSalidas, handleView, handleDelete, openConfirmAnular, 
        handleFilterChange, handleFilterSubmit, handleFilterClear,
        canCancel 
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Código', placeholder: 'S001-00000001', colSpan: 'col-span-12 md:col-span-2' },
        {
            name: 'almacen_id', type: 'custom', label: 'Almacén', colSpan: 'col-span-12 md:col-span-3',
            render: () => (
                <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-1">Almacén</label>
                    <AlmacenSearchSelect isFilter={true} form={filters} setForm={setFilters} />
                </div>
            )
        },
        { 
            name: 'tipo', type: 'select', label: 'Tipo Mov.', 
            options: [
                { value: '', label: 'Todos' },
                { value: '3', label: 'Consumo Cocina' },
                { value: '5', label: 'Merma' },
                { value: '6', label: 'Ajuste' }
            ],
            colSpan: 'col-span-12 md:col-span-3' 
        },
        { 
            name: 'estado', type: 'select', label: 'Estado', 
            options: [{ value: '', label: 'Todos' }, { value: '1', label: 'Completados' }, { value: '0', label: 'Anulados' }],
            colSpan: 'col-span-12 md:col-span-2' 
        }
    ], [filters, setFilters]);

    const columns = useMemo(() => [
        { 
            header: 'Código', 
            render: (row) => <span className="font-black text-red-600 tracking-wider text-xs uppercase">{row.codigo}</span> 
        },
        { 
            header: 'Fecha', 
            render: (row) => (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(row.created_at).toLocaleDateString('es-PE')}
                </div>
            )
        },
        { header: 'Almacén', render: (row) => <span className="uppercase text-[11px] font-bold text-slate-700">{row.almacen?.nombre}</span> },
        { 
            header: 'Tipo', 
            render: (row) => {
                const labels = { 3: 'Consumo Cocina', 5: 'Merma', 6: 'Ajuste' };
                return <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{labels[row.tipo_movimiento]}</span>;
            }
        },
        { 
            header: 'Estado', 
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase border ${row.estado ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {row.estado ? 'Completado' : 'Anulado'}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <button onClick={() => handleView(row.id)} title="Ver Detalle" className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <EyeIcon className="w-5 h-5"/>
                    </button>
                    
                    <button onClick={() => handlePrint(row.id)} title="Imprimir Ticket" className="p-2 text-slate-500 hover:bg-slate-100 hover:text-black rounded-lg transition-colors">
                        <PrinterIcon className="w-5 h-5"/>
                    </button>
                    
                    {row.estado === 1 && (
                        canCancel(row.created_at) ? (
                            <button 
                                onClick={() => openConfirmAnular(row.id)} 
                                title="Anular" 
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                title="Historial de Salidas" 
                subtitle="Control de consumos, mermas y ajustes" 
                icon={ArrowUpRightIcon} 
                buttonText="+ Nueva Salida" 
                buttonLink="/salida/crear" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={salidas} 
                loading={loading} 
                filterConfig={filterConfig} 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onFilterSubmit={handleFilterSubmit} 
                onFilterClear={handleFilterClear} 
                pagination={{...paginationInfo, onPageChange: fetchSalidas}} 
                rowClassName={(row) => !row.estado ? 'opacity-50 bg-slate-50 grayscale font-medium' : ''}
            />
            
            <PdfModal isOpen={isPdfOpen} onClose={closePdfModal} title="Nota de Salida" pdfUrl={pdfUrl} />

            <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Detalle de Salida" isLoading={viewLoading} size="max-w-2xl">
                {viewData && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Almacén Origen</p>
                                <p className="text-sm font-bold uppercase text-slate-700">{viewData.almacen?.nombre}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Observación</p>
                                <p className="text-xs italic text-slate-500">{viewData.observacion || 'Sin observaciones'}</p>
                             </div>
                        </div>

                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-800 text-white uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3">Insumo / Ítem</th>
                                        <th className="p-3 text-center">Cantidad Retirada</th>
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
                    title="¿Anular Salida?" 
                    message="El stock se devolverá automáticamente al almacén de origen. Esta acción quedará registrada en el Kardex y no se puede deshacer." 
                    onConfirm={handleDelete} 
                    onCancel={() => setIsConfirmOpen(false)} 
                    confirmText="Sí, anular salida" 
                    cancelText="No, mantener"
                />
            )}
        </div>
    );
};

export default Index;