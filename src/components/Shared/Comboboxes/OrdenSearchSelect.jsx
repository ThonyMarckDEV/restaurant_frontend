import React, { useState, useEffect, useRef } from 'react';
import { combobox } from 'services/ordenService';
import { MagnifyingGlassIcon, XMarkIcon, ChevronRightIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const TIPO_LABEL = { 1: 'Salón', 2: 'Llevar', 3: 'Delivery' };
const TIPO_CLS   = { 1: 'bg-indigo-100 text-indigo-700', 2: 'bg-amber-100 text-amber-700', 3: 'bg-purple-100 text-purple-700' };

export const obtenerNombreCliente = (orden) => {
    if (!orden) return 'PÚBLICO EN GENERAL';
    if (orden.cliente_nombre_completo) return orden.cliente_nombre_completo;
    if (orden.nombre_llevar) return orden.nombre_llevar;
    const dc = orden.cliente?.datos_cliente || orden.cliente?.datosCliente;
    if (dc) return `${dc.nombre || ''} ${dc.apellidoPaterno || ''}`.trim();
    return 'PÚBLICO EN GENERAL';
};

const OrdenSearchSelect = ({ onSelect, onReset, disabled, resetTrigger }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (resetTrigger) setInputValue('');
    }, [resetTrigger]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowSuggestions(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchOrdenes = async (search = '') => {
        setLoading(true);
        try {
            const res = await combobox(1, { search, estado: '1', forCaja: 'true' });
            setSuggestions(res.data || []);
            setShowSuggestions(true);
        } catch { setSuggestions([]); }
        finally { setLoading(false); }
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchOrdenes(e.target.value), 400);
    };

    const handleSelect = (orden) => {
        onSelect?.(orden);
        const nombreCliente = obtenerNombreCliente(orden);
        const label = orden.tipo_pedido === 1
            ? `Mesa ${orden.mesa?.numero || 'S/N'} — Orden #${orden.id}`
            : `Llevar — ${nombreCliente} — Orden #${orden.id}`;
        setInputValue(label);
        setShowSuggestions(false);
    };

    const handleInternalReset = () => {
        setInputValue('');
        setSuggestions([]);
        setShowSuggestions(false);
        onReset?.();
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center">
                <input
                    type="text" value={inputValue} onChange={handleChange} disabled={disabled}
                    onClick={() => !showSuggestions && !disabled && fetchOrdenes(inputValue)}
                    placeholder="Buscar orden lista para cobrar..."
                    className="w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 py-2.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all disabled:bg-slate-50 disabled:text-slate-500 font-bold"
                    autoComplete="off"
                />
                <div className="absolute left-3 text-slate-400">
                    <ClipboardDocumentListIcon className="w-5 h-5" />
                </div>
                <div className="absolute right-2 flex items-center">
                    {loading
                        ? <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                        : inputValue && !disabled
                            ? <button type="button" onClick={handleInternalReset} className="text-slate-400 hover:text-red-500"><XMarkIcon className="w-4 h-4" /></button>
                            : <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    }
                </div>

                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-72 overflow-y-auto shadow-xl">
                        {suggestions.length > 0 ? suggestions.map(orden => (
                            <li key={orden.id} onClick={() => handleSelect(orden)}
                                className="px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-1.5 rounded-md shrink-0">
                                        <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-800 text-sm leading-tight">
                                            {orden.tipo_pedido === 1 ? `Mesa ${orden.mesa?.numero || 'S/N'}` : obtenerNombreCliente(orden)}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                                            Orden #{orden.id} · {new Date(orden.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${TIPO_CLS[orden.tipo_pedido] || TIPO_CLS[1]}`}>
                                        {TIPO_LABEL[orden.tipo_pedido] || 'Salón'}
                                    </span>
                                    <ChevronRightIcon className="w-4 h-4 text-blue-400" />
                                </div>
                            </li>
                        )) : (
                            <li className="px-4 py-6 text-slate-400 text-xs text-center">No hay órdenes listas.</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrdenSearchSelect;