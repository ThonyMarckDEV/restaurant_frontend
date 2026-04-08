import React from 'react';
import { PlusIcon, CubeIcon } from '@heroicons/react/24/outline';

const ItemGrid = ({ items, loading, onAdd, getPrecio }) => {
    if (loading) return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 animate-pulse">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
        </div>
    );

    if (!items.length) return (
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest py-10">Sin resultados</p>
    );

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {items.map(item => {
                const stock   = item.stock_actual !== undefined ? parseFloat(item.stock_actual || 0) : null;
                const agotado = stock !== null && stock <= 0;
                return (
                    <button key={item.id} type="button" onClick={() => onAdd(item)}
                        className={`group flex flex-col bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl p-2.5 text-left transition-all active:scale-95 relative overflow-hidden ${agotado ? 'opacity-60 grayscale-[0.4]' : ''}`}>
                        <div className="flex justify-between items-start mb-1 w-full gap-1">
                            {item.categoria?.nombre
                                ? <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter truncate">{item.categoria.nombre}</span>
                                : <span />}
                            {stock !== null && (
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border flex items-center gap-0.5 shrink-0 ${stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    <CubeIcon className="w-2.5 h-2.5" />{Number(stock)} {item.unidad_medida?.abreviatura}
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-bold text-gray-800 leading-tight line-clamp-2 flex-1">{item.nombre}</span>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                            <span className="text-xs font-black text-green-600">S/ {parseFloat(getPrecio(item) || 0).toFixed(2)}</span>
                            <div className="bg-gray-50 group-hover:bg-gray-900 group-hover:text-white rounded-full p-0.5 transition-colors">
                                <PlusIcon className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        {agotado && (
                            <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                                <span className="bg-red-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-sm rotate-12 shadow-sm">Agotado</span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default ItemGrid;