import React from 'react';
import { TrashIcon, CheckCircleIcon, PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ESTADOS = {
    1: { label: 'En preparación', cls: 'bg-yellow-100 text-yellow-700' },
    2: { label: 'Entregado',      cls: 'bg-green-100 text-green-700'   },
    3: { label: 'Cancelado',      cls: 'bg-red-100 text-red-600'       },
};

const CartItem = ({ item, idx, onEstado, onCantidad, onObs, isEditing, tipoPedido }) => {
    const est        = ESTADOS[item.estado] || ESTADOS[1];
    const isLocked   = item.estado === 2;
    const isCancelled = item.estado === 3;
    const isNew      = !item.id_detalle;

    const step = (d) => {
        if (d > 0 && item.type === 'insumo' && item.cantidad >= parseFloat(item.stock_actual || 0)) return;
        if (d < 0 && item.cantidad <= 1) return;
        onCantidad(idx, d);
    };

    return (
        <div className={`bg-white rounded-xl border shadow-sm flex flex-col ${isCancelled ? 'opacity-40' : 'border-gray-200'}`}>

            <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-gray-100">
                {tipoPedido === 1 ? (
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${est.cls}`}>
                        {est.label}
                    </span>
                ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {isNew ? 'Nuevo Item' : 'En Comanda'}
                    </span>
                )}

                {!isLocked && !isCancelled && (
                    <button type="button" onClick={() => onEstado(idx, 3)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-0.5">
                        {isNew ? <XMarkIcon className="w-4 h-4" /> : <TrashIcon className="w-3.5 h-3.5" />}
                    </button>
                )}
            </div>

            <div className="px-2.5 py-2 flex flex-col">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                        <p className={`text-xs font-bold leading-tight ${isCancelled ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {item.nombre}
                        </p>

                        {item.type === 'insumo' && !isCancelled && (
                            <p className="text-[9px] font-black text-blue-500 uppercase mt-1">
                                Stock: {Number(item.stock_actual) || 0}
                            </p>
                        )}

                        {item.type === 'menu' && item.platos_menu?.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                                {item.platos_menu.map((p, i) => (
                                    <span key={i} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                                        {p.nombre}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <span className={`text-xs font-black shrink-0 ${isCancelled ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        S/ {(item.precio_unitario * item.cantidad).toFixed(2)}
                    </span>
                </div>

                {!isCancelled && !isLocked && (
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8 bg-white shadow-sm shrink-0">
                            <button type="button" onClick={() => step(-1)}
                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-400">
                                <MinusIcon className="w-3 h-3" />
                            </button>
                            <input type="number" value={item.cantidad || ''} readOnly
                                className="w-10 h-full text-center text-xs font-black text-gray-900 bg-gray-50/50 outline-none" />
                            <button type="button" onClick={() => step(1)}
                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-400">
                                <PlusIcon className="w-3 h-3" />
                            </button>
                        </div>
                        <input type="text" value={item.observaciones || ''}
                            onChange={e => onObs(idx, e.target.value)}
                            placeholder="Nota..."
                            className="flex-1 min-w-0 text-[11px] text-gray-600 bg-transparent outline-none border-b border-dashed border-gray-300 py-1"
                        />
                    </div>
                )}

                {tipoPedido === 1 && isEditing && item.estado === 1 && (
                    <button type="button" onClick={() => onEstado(idx, 2)}
                        className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg text-[11px] font-black flex items-center justify-center gap-1.5 transition-all">
                        <CheckCircleIcon className="w-3.5 h-3.5" /> Marcar como Entregado
                    </button>
                )}
            </div>
        </div>
    );
};

export default CartItem;