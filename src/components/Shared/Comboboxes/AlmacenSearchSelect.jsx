import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/almacenService'; 
import { MagnifyingGlassIcon, HomeModernIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TIPOS_CONFIG = {
    1: { label: 'Principal', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    2: { label: 'Secundario', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    3: { label: 'Producción', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    4: { label: 'Venta', color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

const AlmacenSearchSelect = ({ 
    form, 
    setForm, 
    disabled, 
    isFilter = false, 
    isVenta = false,
    fieldId = 'almacen_id', 
    fieldNombre = 'almacen_nombre' 
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        // 🔥 Sincronización segura con el input
        if (form && typeof form === 'object' && form[fieldNombre]) {
            setInputValue(form[fieldNombre]);
        } else if (typeof form === 'string') {
            setInputValue(form);
        } else {
            setInputValue('');
        }
    }, [form, fieldNombre]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchAlmacenes = async (searchTerm = '') => {
        if (disabled) return;
        setLoading(true);
        try {
            const queryParams = { 
                search: searchTerm, 
                estado: '1',
                ...(isVenta ? { tipo: '4' } : {}) 
            };
            const response = await index(1, queryParams);
            setSuggestions(response.data || []);
            setShowSuggestions(true);
        } catch (error) {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (almacen) => {
        // 🔥 ACTUALIZACIÓN INTELIGENTE 🔥
        if (setForm) {
            setForm(prev => {
                // Si el estado anterior es un objeto (como en Traspaso/Compras)
                if (prev && typeof prev === 'object' && !Array.isArray(prev)) {
                    return { 
                        ...prev, 
                        [fieldId]: almacen.id, 
                        [fieldNombre]: almacen.nombre 
                    };
                }
                // Si es un estado simple de componente (como en la Tab del POS)
                return { [fieldId]: almacen.id, [fieldNombre]: almacen.nombre };
            });
        }
        
        setInputValue(almacen.nombre);
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        if (setForm) {
            setForm(prev => {
                if (prev && typeof prev === 'object' && !Array.isArray(prev)) {
                    return { ...prev, [fieldId]: '', [fieldNombre]: '' };
                }
                return { [fieldId]: '', [fieldNombre]: '' };
            });
        }
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        if (debounceRef.current) clearTimeout(debounceRef.current);
                        debounceRef.current = setTimeout(() => fetchAlmacenes(e.target.value), 500);
                    }}
                    onFocus={() => !disabled && fetchAlmacenes(inputValue)}
                    disabled={disabled}
                    placeholder={isVenta ? "Seleccionar punto de venta..." : "Buscar almacén..."}
                    className={`w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black outline-none transition-all 
                        ${isFilter ? 'py-2' : 'py-2.5'} 
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                    autoComplete="off"
                />
                <div className="absolute left-3 text-slate-400"><HomeModernIcon className="w-4 h-4" /></div>
                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div>
                    ) : inputValue && !disabled ? (
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500 p-1"><XMarkIcon className="w-4 h-4" /></button>
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    )}
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-[100] top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl ring-1 ring-black ring-opacity-5">
                        {suggestions.map((almacen) => (
                            <li
                                key={almacen.id}
                                onMouseDown={(e) => { e.preventDefault(); handleSelect(almacen); }}
                                className="px-4 py-3 cursor-pointer text-sm flex items-center justify-between hover:bg-slate-50 border-b last:border-0"
                            >
                                <span className="uppercase text-slate-800 font-semibold">{almacen.nombre}</span>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${TIPOS_CONFIG[almacen.tipo]?.color}`}>
                                    {TIPOS_CONFIG[almacen.tipo]?.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AlmacenSearchSelect;