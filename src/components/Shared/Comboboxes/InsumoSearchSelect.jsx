import React, { useState, useEffect, useRef } from 'react';
import { combobox } from 'services/insumoService'; 
import { BeakerIcon, XMarkIcon, PlusIcon, ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const InsumoSearchSelect = ({ 
    form, setForm, onSelect, disabled, 
    isFilter = false, isTraspaso = false, isCompra = false, almacenId = null 
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        if (isFilter) {
            if (form?.insumo_nombre) setInputValue(form.insumo_nombre);
            else if (form && !form.insumo_id) setInputValue('');
        }
    }, [form, isFilter]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchInsumos = async (searchTerm = '') => {
        if (isTraspaso && !almacenId) return; 
        
        setLoading(true);
        try {
            const queryParams = { search: searchTerm, estado: '1' };
            
            if (isTraspaso) queryParams.almacen_id = almacenId;
            
            if (isCompra) queryParams.es_inventariable = 'true';
            else if (!isFilter) queryParams.es_inventariable = 'true';

            const response = await combobox(1, queryParams);
            setSuggestions(response.data || []);
            setShowSuggestions(true);
        } catch (error) { 
            setSuggestions([]); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);
        if (isFilter && form?.insumo_id && setForm) setForm(prev => ({ ...prev, insumo_id: '', insumo_nombre: '' }));
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchInsumos(texto), 500);
    };

    const handleSelect = (insumo) => {
        if (onSelect) {
            onSelect(insumo); 
            setInputValue(''); 
        } else {
            setInputValue(insumo.nombre);
            if (setForm) setForm(prev => ({ ...prev, insumo_id: insumo.id, insumo_nombre: insumo.nombre }));
        }
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center group">
                <input
                    type="text" value={inputValue} onChange={handleChange}
                    onClick={() => !showSuggestions && !disabled && fetchInsumos(inputValue)}
                    disabled={disabled || (isTraspaso && !almacenId)}
                    placeholder={isCompra ? "Buscar insumo para comprar..." : "Buscar insumo..."}
                    className={`w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black outline-none transition-all py-2.5 
                        ${(disabled || (isTraspaso && !almacenId)) ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}`}
                    autoComplete="off"
                />
                <div className="absolute left-3 text-slate-400">
                    {isCompra ? <ShoppingCartIcon className="w-4 h-4" /> : <BeakerIcon className="w-4 h-4" />}
                </div>
                
                <div className="absolute right-2 flex items-center">
                    {loading ? <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div>
                    : (inputValue && !disabled) ? (
                        <button onClick={() => { setInputValue(''); if(isFilter && setForm) setForm(prev => ({...prev, insumo_id: '', insumo_nombre: ''})) }} type="button" className="text-slate-400 hover:text-red-500">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    ) : <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />}
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl ring-1 ring-black ring-opacity-5">
                        {suggestions.map((insumo) => (
                            <li key={insumo.id} onClick={() => handleSelect(insumo)} className="px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between hover:bg-slate-50 border-b last:border-0 transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-bold uppercase text-[11px] text-slate-700">{insumo.nombre}</span>
                                    {isCompra && (
                                        <span className="text-[9px] text-slate-400 font-medium italic">
                                            U. Compra: {insumo.unidad_compra?.nombre || 'No definida'}
                                        </span>
                                    )}
                                </div>
                                
                                {!isFilter && (
                                    <div className="flex items-center gap-3">
                                        {isCompra ? (
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-blue-600">
                                                    Ref: S/ {parseFloat(insumo.costo_referencial || 0).toFixed(2)}
                                                </p>
                                            </div>
                                        ) : isTraspaso ? (
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${Number(insumo.stock_actual) > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                Stock: {Number(insumo.stock_actual || 0)}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border">
                                                S/ {parseFloat(insumo.costo_referencial || 0).toFixed(2)}
                                            </span>
                                        )}
                                        <PlusIcon className="w-5 h-5 text-blue-500 bg-blue-50 p-1 rounded-full" />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default InsumoSearchSelect;