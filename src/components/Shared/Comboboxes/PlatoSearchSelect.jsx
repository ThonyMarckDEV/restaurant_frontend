import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/platoService'; 
import { MagnifyingGlassIcon, FireIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const PlatoSearchSelect = ({ 
    form, setForm, onSelect, disabled, isFilter = false, 
    fieldId = 'plato_id', fieldNombre = 'plato_nombre' 
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        if (form?.[fieldNombre]) setInputValue(form[fieldNombre]);
        else if (form && !form[fieldId]) setInputValue('');
    }, [form, fieldId, fieldNombre]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchPlatos = async (searchTerm = '') => {
        setLoading(true);
        try {
            // Para el POS, solo trae platos activos y que se puedan vender
            const response = await index(1, { search: searchTerm, estado: '1' });
            setSuggestions(response.data || []);
            setShowSuggestions(true);
        } catch (error) { setSuggestions([]); } 
        finally { setLoading(false); }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);
        if (form?.[fieldId] && setForm) setForm(prev => ({ ...prev, [fieldId]: '', [fieldNombre]: '' }));
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchPlatos(texto), 500);
    };

    const handleSelect = (plato) => {
        if (onSelect) {
            onSelect(plato);
            setInputValue(''); // Limpieza automática si es para el POS
        } else {
            setInputValue(plato.nombre);
            if (setForm) setForm(prev => ({ ...prev, [fieldId]: plato.id, [fieldNombre]: plato.nombre }));
        }
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        if (setForm) setForm(prev => ({ ...prev, [fieldId]: '', [fieldNombre]: '' }));
        fetchPlatos('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center group">
                <input
                    type="text" value={inputValue} onChange={handleChange}
                    onClick={() => !showSuggestions && !disabled && fetchPlatos(inputValue)}
                    disabled={disabled}
                    placeholder={isFilter ? "Todos los platos" : "Buscar plato..."}
                    className={`w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black outline-none transition-all ${isFilter ? 'py-2' : 'py-2.5'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    autoComplete="off"
                />
                <div className="absolute left-3 text-slate-400"><FireIcon className="w-4 h-4" /></div>
                <div className="absolute right-2 flex items-center">
                    {loading ? <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div> 
                    : inputValue && !disabled ? <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500"><XMarkIcon className="w-4 h-4" /></button> 
                    : <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />}
                </div>

                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                        {suggestions.length > 0 ? suggestions.map((p) => (
                            <li key={p.id} onClick={() => handleSelect(p)} className={`px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between hover:bg-blue-50 border-b last:border-0 ${form?.[fieldId] === p.id ? 'bg-slate-100 font-bold' : ''}`}>
                                <div className="flex flex-col">
                                    <span className="uppercase font-bold text-slate-800">{p.nombre}</span>
                                    <span className="text-[10px] text-slate-400 uppercase">{p.categoria?.nombre}</span>
                                </div>
                                {onSelect && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200">
                                            S/ {parseFloat(p.precio_carta).toFixed(2)}
                                        </span>
                                        <PlusIcon className="w-5 h-5 text-blue-500" />
                                    </div>
                                )}
                            </li>
                        )) : <li className="px-4 py-3 text-slate-400 text-xs text-center italic">No se encontraron platos</li>}
                    </ul>
                )}
            </div>
        </div>
    );
};
export default PlatoSearchSelect;