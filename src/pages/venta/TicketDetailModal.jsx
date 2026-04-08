import React from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { TicketIcon } from '@heroicons/react/24/outline';

const TicketDetailModal = ({ isOpen, onClose, data, isLoading }) => {
    // Helper local para el estado, así el modal es 100% independiente
    const getEstadoBadge = (estado) => {
        return estado ? 
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-emerald-100 uppercase tracking-wide">Pagado</span> : 
            <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-rose-100 uppercase tracking-wide">Anulado</span>;
    };

    return (
        <ViewModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Detalle del Comprobante"
            isLoading={isLoading}
        >
            {data && (
                <div className="max-w-md mx-auto bg-white p-2">
                    <div className="text-center mb-6 border-b-2 border-dashed border-slate-200 pb-6">
                        <TicketIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{data.codigo}</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Ticket de Venta</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-xl">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Cliente</p>
                            <p className="text-xs font-bold text-slate-800 uppercase">
                                {data.cliente ? (
                                    data.cliente.datosCliente?.razon_social || 
                                    `${data.cliente.datosCliente?.nombre || ''} ${data.cliente.datosCliente?.apellidoPaterno || ''}`.trim()
                                ) : 'Público General'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Cajero</p>
                            <p className="text-xs font-bold text-slate-800 uppercase">
                                {data.cajero?.datosEmpleado?.nombre} {data.cajero?.datosEmpleado?.apellidoPaterno}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Fecha / Hora</p>
                            <p className="text-xs font-bold text-slate-800">{new Date(data.created_at).toLocaleString('es-PE')}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Estado</p>
                            {getEstadoBadge(data.estado)}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-3">
                            <span>Cant / Desc</span>
                            <span>Total</span>
                        </div>
                        <div className="space-y-3">
                            {data.orden?.detalles?.map((det, idx) => (
                                <div key={idx} className="flex justify-between items-start text-sm">
                                    <div className="flex gap-2">
                                        <span className="font-mono font-bold text-slate-500">{Math.round(det.cantidad)}</span>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">
                                                {det.plato?.nombre || det.insumo?.nombre || det.menu?.nombre || det.adicional?.nombre}
                                            </span>
                                            {det.platosMenu && det.platosMenu.length > 0 && (
                                                <span className="text-[10px] text-slate-500 italic mt-0.5 leading-tight">
                                                    + {det.platosMenu.map(pm => pm.plato?.nombre).join(', ')}
                                                </span>
                                            )}
                                            {det.observaciones && (
                                                <span className="text-[10px] text-amber-600 font-bold italic mt-0.5 leading-tight">
                                                    Nota: {det.observaciones}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-black text-slate-900 font-mono">S/ {Number(det.subtotal).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totales y Datos de Pago */}
                    <div className="border-t-2 border-slate-200 border-dashed pt-4">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                            <span>Subtotal:</span>
                            <span>S/ {(Number(data.total) / 1.18).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-4 pb-4 border-b border-slate-100">
                            <span>IGV (18%):</span>
                            <span>S/ {(Number(data.total) - (Number(data.total) / 1.18)).toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-sm font-black text-slate-900 uppercase">Total Pagado:</span>
                            <span className="text-2xl font-black text-emerald-600 font-mono">S/ {Number(data.total).toFixed(2)}</span>
                        </div>

                        <div className="bg-slate-100 p-3 rounded-lg text-xs space-y-1">
                            <div className="flex justify-between">
                                <span className="font-bold text-slate-500">Método de Pago:</span>
                                <span className="font-black text-slate-800 uppercase">
                                    {data.metodo_pago === 1 ? 'Efectivo' : data.metodo_pago === 2 ? 'Tarjeta' : 'Yape/Plin'}
                                </span>
                            </div>
                            {data.metodo_pago === 1 ? (
                                <>
                                    <div className="flex justify-between">
                                        <span className="font-bold text-slate-500">Pagó con:</span>
                                        <span className="font-mono font-bold text-slate-800">S/ {Number(data.pago_con).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-bold text-slate-500">Vuelto:</span>
                                        <span className="font-mono font-bold text-slate-800">S/ {Number(data.vuelto).toFixed(2)}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-500">Operación Nro:</span>
                                    <span className="font-mono font-bold text-slate-800">{data.nro_operacion || '---'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </ViewModal>
    );
};

export default TicketDetailModal;