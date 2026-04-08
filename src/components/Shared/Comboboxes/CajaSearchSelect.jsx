import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/cajaService';
import { MagnifyingGlassIcon, ArchiveBoxIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CajaSearchSelect = ({ 
    form, setForm, onSelect, disabled, isFilter = false, 
    fieldId = 'caja_id', fieldNombre = 'caja_nombre' 
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    // Sincronizar input si el padre cambia el form (ej. al editar)
    useEffect(() => {
        if (form?.[fieldNombre]) setInputValue(form[fieldNombre]);
        else if (form && !form[fieldId]) setInputValue('');
    }, [form, fieldId, fieldNombre]);

    // Cerrar sugerencias al hacer clic afuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchCajas = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await index(1, { search: searchTerm, activo: '1', disponible: 'true' });
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
        
        // Limpiar el ID si el usuario empieza a borrar
        if (form?.[fieldId] && setForm) {
            setForm(prev => ({ ...prev, [fieldId]: '', [fieldNombre]: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchCajas(texto), 400);
    };

    const handleSelect = (caja) => {
        if (onSelect) {
            onSelect(caja);
            setInputValue(''); // Si hay un onSelect custom, usualmente queremos limpiar (ej. agregar a lista)
        } else {
            setInputValue(caja.nombre);
            if (setForm) setForm(prev => ({ ...prev, [fieldId]: caja.id, [fieldNombre]: caja.nombre }));
        }
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        if (setForm) setForm(prev => ({ ...prev, [fieldId]: '', [fieldNombre]: '' }));
        fetchCajas(''); // Traer todo de nuevo al limpiar
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center group">
                <input
                    type="text" 
                    value={inputValue} 
                    onChange={handleChange}
                    onClick={() => !showSuggestions && !disabled && fetchCajas(inputValue)}
                    disabled={disabled}
                    placeholder={isFilter ? "Todas las cajas" : "Buscar caja disponible..."}
                    className={`w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black outline-none transition-all ${isFilter ? 'py-2' : 'py-2.5'} ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white font-bold'}`}
                    autoComplete="off"
                />
                
                <div className="absolute left-3 text-slate-400">
                    <ArchiveBoxIcon className="w-4 h-4" />
                </div>
                
                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div> 
                    ) : inputValue && !disabled && !isFilter ? (
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500">
                            <XMarkIcon className="w-4 h-4" />
                        </button> 
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    )}
                </div>

                {showSuggestions && !disabled && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                        {suggestions.length > 0 ? suggestions.map((caja) => (
                            <li 
                                key={caja.id} 
                                onClick={() => handleSelect(caja)} 
                                className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors ${form?.[fieldId] === caja.id ? 'bg-slate-50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md shrink-0 ${form?.[fieldId] === caja.id ? 'bg-black text-white' : 'bg-slate-100 text-slate-600'}`}>
                                        <ArchiveBoxIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="uppercase font-black text-slate-800 text-xs leading-tight">
                                            {caja.nombre}
                                        </span>
                                        {caja.descripcion && (
                                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 truncate max-w-[150px]">
                                                {caja.descripcion}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRightIcon className="w-4 h-4 text-slate-300" />
                            </li>
                        )) : (
                            <li className="px-4 py-6 flex flex-col items-center justify-center gap-2">
                                <ArchiveBoxIcon className="w-8 h-8 text-slate-200" />
                                <span className="text-slate-400 text-xs font-bold uppercase text-center">
                                    No hay cajas disponibles o todas tienen turno abierto
                                </span>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CajaSearchSelect;