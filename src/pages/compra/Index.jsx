import React, { useMemo } from 'react';
import { useIndex } from 'hooks/compra/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ViewModal from 'components/Shared/Modals/ViewModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import ProveedorSearchSelect from 'components/Shared/Comboboxes/ProveedorSearchSelect';
import { 
    ShoppingBagIcon, 
    EyeIcon, 
    CalendarDaysIcon, 
    BuildingOfficeIcon, 
    TrashIcon, 
    XCircleIcon 
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, compras, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading,
        isConfirmOpen, setIsConfirmOpen,
        fetchCompras, handleView, handleFilterChange, handleFilterSubmit, handleFilterClear,
        handleDelete, openConfirmAnular, canCancel
    } = useIndex();

    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'N° Comprobante', 
            placeholder: 'Ej: 000123', 
            colSpan: 'col-span-12 md:col-span-2' 
        },
        {
            name: 'proveedor_id', 
            type: 'custom', 
            label: 'Proveedor', 
            colSpan: 'col-span-12 md:col-span-4',
            render: () => <ProveedorSearchSelect isFilter={true} form={filters} setForm={setFilters} />
        },
        { 
            name: 'fecha', 
            type: 'date', 
            label: 'Fecha Compra', 
            colSpan: 'col-span-12 md:col-span-3' 
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
            colSpan: 'col-span-12 md:col-span-3' 
        }
    ], [filters, setFilters]);

    const columns = useMemo(() => [
        { 
            header: 'Fecha', 
            render: (row) => (
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                    {new Date(row.fecha_compra).toLocaleDateString('es-PE')}
                </div>
            )
        },
        { 
            header: 'Comprobante', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{row.tipo_comprobante}</span>
                    <span className="font-bold text-slate-800">{row.serie_comprobante}-{row.num_comprobante}</span>
                </div>
            )
        },
        { 
            header: 'Proveedor', 
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="bg-slate-100 p-1.5 rounded-md"><BuildingOfficeIcon className="w-4 h-4 text-slate-500" /></div>
                    <span className="font-bold text-slate-700 text-[11px] uppercase truncate max-w-[180px]">{row.proveedor?.razon_social}</span>
                </div>
            )
        },
        { 
            header: 'Total', 
            render: (row) => (
                <span className="text-sm font-black text-slate-900 font-mono text-right block">
                    S/ {parseFloat(row.total).toFixed(2)}
                </span>
            )
        },
        { 
            header: 'Estado', 
            render: (row) => {
                const isActivo = row.estado === true || row.estado === 1;
                return (
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase border ${
                        isActivo 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                        {isActivo ? 'Completado' : 'Anulado'}
                    </span>
                );
            }
        },
        { 
            header: 'Acciones', 
            render: (row) => {
                const isActivo = row.estado === true || row.estado === 1;
                return (
                    <div className="flex items-center gap-1">
                        <button onClick={() => handleView(row.id)} title="Ver detalle" className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                            <EyeIcon className="w-5 h-5"/>
                        </button>
                        
                        {isActivo && canCancel(row.created_at) ? (
                            <button 
                                onClick={() => openConfirmAnular(row.id)} 
                                title="Anular Compra" 
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        ) : isActivo ? (
                            <div className="p-2 cursor-help" title="Tiempo de anulación expirado (24h)">
                                <XCircleIcon className="w-5 h-5 text-slate-300" />
                            </div>
                        ) : null}
                    </div>
                );
            }
        }
    ], [handleView, openConfirmAnular, canCancel]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Historial de Compras" icon={ShoppingBagIcon} buttonText="+ Registrar Compra" buttonLink="/compra/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={compras} 
                loading={loading} 
                filterConfig={filterConfig}
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onFilterSubmit={handleFilterSubmit} 
                onFilterClear={handleFilterClear} 
                pagination={{...paginationInfo, onPageChange: fetchCompras}} 
                rowClassName={(row) => (row.estado === false || row.estado === 0) ? 'opacity-60 bg-slate-50 grayscale font-medium' : ''}
            />

            {/* Modal de Detalle */}
            <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Detalle de Compra" isLoading={viewLoading} size="max-w-4xl">
                {viewData && (
                    <div className="space-y-6 text-slate-800">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Proveedor</p><p className="text-xs font-bold">{viewData.proveedor?.razon_social}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Documento</p><p className="text-xs font-bold">{viewData.tipo_comprobante} {viewData.serie_comprobante}-{viewData.num_comprobante}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Fecha</p><p className="text-xs font-bold">{new Date(viewData.fecha_compra).toLocaleDateString('es-PE')}</p></div>
                            <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase">Total Pagado</p><p className="text-lg font-black text-green-600 font-mono">S/ {parseFloat(viewData.total).toFixed(2)}</p></div>
                        </div>

                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-800 text-white uppercase text-[10px]">
                                    <tr>
                                        <th className="px-4 py-3">Insumo / Ítem</th>
                                        <th className="px-4 py-3 text-center">Cant. Comprada</th>
                                        <th className="px-4 py-3 text-right">P. Unit (Compra)</th>
                                        <th className="px-4 py-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {viewData.detalles?.map(det => (
                                        <tr key={det.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <p className="font-bold uppercase text-slate-800">{det.insumo?.nombre}</p>
                                                <p className="text-[9px] text-slate-400 font-medium italic">
                                                    Equiv: 1 {det.insumo?.unidad_compra?.nombre} = {Number(det.factor_momento)} {det.insumo?.unidad_medida?.abreviatura}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-black text-slate-700">{Number(det.cantidad)}</span>
                                                        <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-black uppercase border border-slate-300">
                                                            {det.insumo?.unidad_compra?.nombre}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">Stock +:</span>
                                                        <span className="text-[10px] font-bold">
                                                            {Number(det.cantidad * det.factor_momento)} {det.insumo?.unidad_medida?.abreviatura}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-slate-600">
                                                S/ {parseFloat(det.precio_unitario).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-black font-mono text-slate-800 bg-slate-50/50">
                                                S/ {parseFloat(det.subtotal).toFixed(2)}
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
                    title="¿Anular esta compra?"
                    message="Esta acción revertirá el stock de todos los insumos ingresados y marcará el comprobante como anulado para auditoría. Esta operación no se puede deshacer."
                    onConfirm={handleDelete}
                    onCancel={() => setIsConfirmOpen(false)}
                    confirmText="Sí, anular compra"
                    cancelText="No, mantener"
                />
            )}
        </div>
    );
};

export default Index;