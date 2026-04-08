import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/adicionalService'; 
import { MagnifyingGlassIcon, PlusCircleIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const AdicionalSearchSelect = ({ onSelect, disabled }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchAdicionales = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await index(1, { search: searchTerm, estado: '1' });
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
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchAdicionales(texto), 500);
    };

    const handleSelect = (adicional) => {
        if (onSelect) {
            onSelect(adicional);
            setInputValue(''); 
        }
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center group">
                <input
                    type="text" 
                    value={inputValue} 
                    onChange={handleChange}
                    onClick={() => !showSuggestions && !disabled && fetchAdicionales(inputValue)}
                    disabled={disabled}
                    placeholder="Buscar adicional (ej. Cremas, Porciones)..."
                    className="w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 py-2.5 text-sm focus:ring-1 focus:ring-black outline-none bg-white transition-all"
                    autoComplete="off"
                />
                <div className="absolute left-3 text-slate-400"><PlusCircleIcon className="w-4 h-4" /></div>
                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div> 
                    ) : inputValue && !disabled ? (
                        <button onClick={() => setInputValue('')} type="button" className="text-slate-400 hover:text-red-500">
                            <XMarkIcon className="w-4 h-4" />
                        </button> 
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    )}
                </div>

                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                        {suggestions.length > 0 ? suggestions.map((a) => (
                            <li key={a.id} onClick={() => handleSelect(a)} className="px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between hover:bg-orange-50 border-b last:border-0">
                                <div className="flex flex-col">
                                    <span className="uppercase font-bold text-slate-800">{a.nombre}</span>
                                    <span className="text-[10px] text-orange-600 font-black tracking-wider">ADICIONAL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200">
                                        S/ {parseFloat(a.precio).toFixed(2)}
                                    </span>
                                    <PlusIcon className="w-5 h-5 text-orange-500" />
                                </div>
                            </li>
                        )) : (
                            <li className="px-4 py-3 text-slate-400 text-xs text-center italic">No hay adicionales</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}; // <--- Aquí faltaba esta llave de cierre

export default AdicionalSearchSelect;