import React, { useMemo } from 'react';
import OrdenSearchSelect from 'components/Shared/Comboboxes/OrdenSearchSelect';
import { 
    CurrencyDollarIcon, 
    CreditCardIcon, 
    DevicePhoneMobileIcon, 
    CheckCircleIcon, 
    TicketIcon,
    UserIcon
} from '@heroicons/react/24/outline';

const VentaForm = ({ 
    formData, loading, loadingOrden, ordenDetalle,
    handleChange, handleOrdenSelect, handleOrdenReset, handleSubmit  , resetTrigger
}) => {

    const metodosPago = [
        { id: 1, label: 'Efectivo',    icon: CurrencyDollarIcon,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { id: 2, label: 'Tarjeta',     icon: CreditCardIcon,       color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
        { id: 3, label: 'Yape / Plin', icon: DevicePhoneMobileIcon,color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-200'  },
    ];

    const isLlevar = ordenDetalle?.tipo_pedido === 2 || ordenDetalle?.tipo_pedido === 3;
    const tituloTicket = isLlevar ? 'PARA LLEVAR' : `MESA ${ordenDetalle?.mesa?.numero || 'S/N'}`;
    
    const nombreEnTicket = ordenDetalle?.cliente_nombre_completo || ordenDetalle?.nombre_llevar || 'PÚBLICO EN GENERAL';

    const labelTipoCliente = ordenDetalle?.cliente_nombre_completo 
        ? 'Cliente Registrado' 
        : ordenDetalle?.nombre_llevar 
            ? 'Cliente al paso (Genérico)' 
            : 'Cliente';

    const totalReal = useMemo(() => {
        if (!ordenDetalle?.detalles) return 0;
        return ordenDetalle.detalles.reduce((acc, det) => {
            if (det.estado !== 5) {
                return acc + Number(det.subtotal);
            }
            return acc;
        }, 0);
    }, [ordenDetalle]);

    React.useEffect(() => {
        if (ordenDetalle && totalReal !== formData.total) {
            handleChange('total', totalReal);
            if (formData.metodo_pago === 1 && formData.pago_con) {
                const vuelto = Number(formData.pago_con) - totalReal;
                handleChange('vuelto', vuelto >= 0 ? vuelto.toFixed(2) : '0.00');
            }
        }
    }, [totalReal, ordenDetalle, handleChange, formData.total, formData.metodo_pago, formData.pago_con]);


    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            
            <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Buscar Orden */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                    <div>
                        <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">1. Buscar Orden Abierta</label>
                        <OrdenSearchSelect onSelect={handleOrdenSelect} onReset={handleOrdenReset} disabled={loading} resetTrigger={resetTrigger} />
                        
                        {ordenDetalle && (
                            <div className="mt-3 bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-start gap-3">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <UserIcon className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">
                                        {labelTipoCliente}
                                    </span>
                                    <span className="text-sm text-indigo-900 font-black uppercase leading-tight">
                                        {nombreEnTicket}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Método de Pago */}
                <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5 transition-opacity ${!ordenDetalle ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="block text-[11px] font-black uppercase text-slate-500">2. Método de Pago</label>
                    <div className="grid grid-cols-3 gap-3">
                        {metodosPago.map(mp => (
                            <button
                                key={mp.id} type="button"
                                onClick={() => handleChange('metodo_pago', mp.id)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                    formData.metodo_pago === mp.id
                                        ? `${mp.border} ${mp.bg} ring-2 ring-offset-1 ring-${mp.color.split('-')[1]}-500`
                                        : 'border-slate-100 hover:border-slate-300 bg-white'
                                }`}
                            >
                                <mp.icon className={`w-6 h-6 mb-1 ${formData.metodo_pago === mp.id ? mp.color : 'text-slate-400'}`} />
                                <span className={`text-[10px] font-black uppercase ${formData.metodo_pago === mp.id ? mp.color : 'text-slate-500'}`}>{mp.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-4">
                        {formData.metodo_pago === 1 ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Pagó con (S/)</label>
                                    <input 
                                        type="number" step="0.01" min={totalReal}
                                        value={formData.pago_con}
                                        onChange={(e) => handleChange('pago_con', e.target.value)}
                                        required placeholder="0.00"
                                        className="w-full text-lg font-black text-slate-800 border-b-2 border-slate-200 focus:border-emerald-500 outline-none pb-1 bg-transparent placeholder:text-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Vuelto (S/)</label>
                                    <input 
                                        type="text" readOnly value={formData.vuelto}
                                        className="w-full text-lg font-black text-emerald-600 border-b-2 border-transparent outline-none pb-1 bg-transparent"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Nro. de Operación / Referencia</label>
                                <input 
                                    type="text" value={formData.nro_operacion}
                                    onChange={(e) => handleChange('nro_operacion', e.target.value)}
                                    placeholder="Ej: 000456123..."
                                    className="w-full text-sm font-bold text-slate-800 border border-slate-200 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none bg-slate-50"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button 
                    type="submit" disabled={loading || !ordenDetalle || totalReal === 0}
                    className="w-full bg-black text-white py-4 rounded-xl font-black uppercase hover:bg-slate-900 transition-all shadow-lg shadow-slate-300 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircleIcon className="w-6 h-6" />}
                    {loading ? 'Procesando Pago...' : 'Confirmar Cobro'}
                </button>
            </div>

            <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-hidden flex flex-col">
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
                        <TicketIcon className="w-6 h-6 text-slate-400" />
                        <h3 className="font-black uppercase text-slate-700 tracking-wider">Resumen de la Cuenta</h3>
                    </div>

                    <div className="p-6 flex-1 flex flex-col bg-[#fdfdfd]">
                        {loadingOrden ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-xs font-bold uppercase tracking-widest">Cargando orden...</p>
                            </div>
                        ) : !ordenDetalle ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                                <TicketIcon className="w-16 h-16 mb-4 opacity-50" />
                                <p className="text-sm font-bold">Selecciona una orden abierta</p>
                                <p className="text-[10px] uppercase tracking-widest mt-1">Para visualizar el ticket</p>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-6 border-b-2 border-dashed border-slate-200 pb-6">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1 uppercase">
                                        {tituloTicket}
                                    </h2>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Orden #{ordenDetalle.id.toString().padStart(6, '0')}</p>
                                    
                                    <div className="mt-3 bg-slate-100 text-slate-700 py-1.5 px-3 rounded inline-block text-[11px]">
                                        <span className="font-black uppercase tracking-wider text-slate-500 mr-1">Cliente:</span>
                                        <span className="font-bold uppercase">{nombreEnTicket}</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-1 mb-6">
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-3">
                                        <span>Cant / Desc</span>
                                        <span>Total</span>
                                    </div>
                                    {ordenDetalle.detalles?.map((det, idx) => {
                                        const isCancelado = det.estado === 5;
                                        return (
                                            <div key={idx} className={`py-2 border-b border-slate-50 flex justify-between items-start ${isCancelado ? 'opacity-40 grayscale' : ''}`}>
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-2">
                                                        <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${isCancelado ? 'bg-rose-100 text-rose-500 line-through' : 'bg-slate-100 text-slate-500'}`}>
                                                            {Math.round(det.cantidad)}
                                                        </span>
                                                        <div className="flex flex-col">
                                                            <p className={`text-sm font-bold leading-tight ${isCancelado ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                                                {det.plato?.nombre || det.insumo?.nombre || det.menu?.nombre || det.adicional?.nombre}
                                                            </p>
                                                            {isCancelado && (
                                                                <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider mt-0.5">Cancelado</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {det.platos_menu?.length > 0 && (
                                                        <p className={`mt-1 pl-8 text-[11px] leading-tight ${isCancelado ? 'text-slate-300 line-through' : 'text-slate-400'}`}>
                                                            + {det.platos_menu.map(p => p.nombre || p.plato?.nombre).join(' + ')}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className={`text-sm font-black font-mono ${isCancelado ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                                        {isCancelado ? '0.00' : Number(det.subtotal).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-slate-900 rounded-xl p-5 text-white flex justify-between items-end shadow-lg">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">A Pagar</p>
                                        <p className="text-[10px] text-slate-500">IGV INCLUIDO (18%)</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-emerald-400 mr-2 uppercase tracking-tighter italic">Soles</span>
                                        <span className="text-4xl font-black tabular-nums">{totalReal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default VentaForm;