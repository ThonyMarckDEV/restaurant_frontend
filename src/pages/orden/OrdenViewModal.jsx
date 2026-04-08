import React from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { 
    UserIcon, 
    MapPinIcon, 
    CalendarDaysIcon, 
    TicketIcon, 
    ShoppingBagIcon 
} from '@heroicons/react/24/outline';

const OrdenViewModal = ({ isOpen, onClose, data, isLoading }) => {
    if (!data && !isLoading) return null;

    const total = data?.detalles?.reduce((acc, curr) => acc + Number(curr.subtotal), 0) || 0;
    
    const isLlevar = data?.tipo_pedido === 2;

    const getNombreCliente = () => {
        if (data?.nombre_llevar) return data.nombre_llevar;
        if (data?.cliente_nombre_completo) return data.cliente_nombre_completo;
        if (data?.cliente?.datos_cliente) {
            const { nombre, apellidoPaterno } = data.cliente.datos_cliente;
            return `${nombre} ${apellidoPaterno}`.trim();
        }
        return 'Cliente General';
    };

    return (
        <ViewModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Detalle de Comanda"
            isLoading={isLoading}
        >
            <div className="max-w-xl mx-auto bg-white">
                {/* Cabecera Tipo Ticket */}
                <div className="text-center mb-8 border-b-2 border-dashed border-slate-200 pb-6">
                    <TicketIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">ORDEN #{data?.id?.toString().padStart(6, '0')}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
                        {isLlevar ? 'Pedido para Llevar' : 'Consumo en Salón'}
                    </p>
                </div>

                {/* Info de Servicio Reusable */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8">
                    {/* Ubicación o Identificador de Cliente */}
                    <div className="flex items-center gap-3">
                        {isLlevar ? (
                            <ShoppingBagIcon className="w-5 h-5 text-amber-500" />
                        ) : (
                            <MapPinIcon className="w-5 h-5 text-blue-500" />
                        )}
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">
                                {isLlevar ? 'Cliente' : 'Ubicación'}
                            </p>
                            <p className="text-sm font-bold text-slate-800">
                                {isLlevar ? getNombreCliente() : `Mesa ${data?.mesa?.numero || 'S/N'}`}
                            </p>
                        </div>
                    </div>

                    {/* Atendido por */}
                    <div className="flex items-center gap-3">
                        <UserIcon className="w-5 h-5 text-indigo-500" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Atendido por</p>
                            <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">
                                {data?.mozo_atendio || data?.usuario?.username || 'Sistema'}
                            </p>
                        </div>
                    </div>

                    {/* Fecha */}
                    <div className="flex items-center gap-3 col-span-2">
                        <CalendarDaysIcon className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Fecha y Hora</p>
                            <p className="text-sm font-bold text-slate-800">
                                {data?.created_at ? new Date(data.created_at).toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' }) : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de Productos */}
                <div className="space-y-1 mb-8">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-4">
                        <span>Descripción / Cantidad</span>
                        <span>Total</span>
                    </div>
                    
                    {data?.detalles?.map((det, idx) => (
                        <div key={idx} className="py-3 border-b border-slate-50 last:border-0">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                            {Math.round(det.cantidad)}x
                                        </span>
                                        <p className="text-sm font-bold text-slate-800">
                                            {det.plato?.nombre || det.insumo?.nombre || det.menu?.nombre || det.adicional?.nombre}
                                        </p>
                                    </div>
                                    
                                    {/* Sub-platos si es menú */}
                                    {det.platos_menu?.length > 0 && (
                                        <p className="mt-1.5 ml-10 text-[11px] text-slate-400 leading-tight italic">
                                            {det.platos_menu.map(p => p.nombre || p.plato?.nombre).join(' + ')}
                                        </p>
                                    )}

                                    {det.observaciones && (
                                        <p className="mt-1.5 ml-10 text-[10px] font-bold text-amber-600">
                                            ⚠️ "{det.observaciones}"
                                        </p>
                                    )}
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-sm font-black text-slate-900 font-mono">
                                        {Number(det.subtotal).toFixed(2)}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-300">
                                        {Number(det.precio_unitario).toFixed(2)} c/u
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pie de Ticket / Total */}
                <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 border-dashed">
                    <div className="flex justify-between items-center mb-2 text-slate-500 text-xs font-bold">
                        <span>SUBTOTAL</span>
                        <span className="font-mono">S/ {(total / 1.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-slate-500 text-xs font-bold border-b border-slate-200 pb-2">
                        <span>IGV (18%)</span>
                        <span className="font-mono">S/ {(total - (total / 1.18)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Total a Pagar</span>
                        <div className="text-right">
                            <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">
                                S/ {total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </ViewModal>
    );
};

export default OrdenViewModal;