import React, { useState, useEffect, useRef } from 'react';
import { combobox } from 'services/categoriaPlatoService'; 
import { MagnifyingGlassIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline';

const CategoriaPlatoSearchSelect = ({ 
    form, 
    setForm, 
    disabled, 
    isFilter = false, 
    fieldId = 'categoria_id', 
    fieldNombre = 'categoria_nombre' 
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    // Sincronizar el input usando las llaves dinámicas
    useEffect(() => {
        if (form?.[fieldNombre]) {
            setInputValue(form[fieldNombre]);
        } else if (!form?.[fieldId]) {
            setInputValue('');
        }
    }, [form, fieldId, fieldNombre]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchCategorias = async (searchTerm = '') => {
        setLoading(true);
        try {
            const queryParams = { search: searchTerm, estado: '1' };
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

        // Limpiar las llaves dinámicas al escribir
        if (form?.[fieldId]) {
            setForm(prev => ({ ...prev, [fieldId]: '', [fieldNombre]: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchCategorias(texto), 500);
    };

    const handleSelect = (categoria) => {
        setInputValue(categoria.nombre);
        setForm(prev => ({ 
            ...prev, 
            [fieldId]: categoria.id, 
            [fieldNombre]: categoria.nombre 
        }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, [fieldId]: '', [fieldNombre]: '' }));
        fetchCategorias('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={() => !showSuggestions && !disabled && fetchCategorias(inputValue)}
                    disabled={disabled}
                    placeholder={isFilter ? "Todas las categorías" : "Buscar categoría..."}
                    className={`w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all 
                        ${isFilter ? 'py-2' : 'py-2.5'} 
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                    autoComplete="off"
                />
                <div className="absolute left-3 text-slate-400">
                    <TagIcon className="w-4 h-4" />
                </div>
                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div>
                    ) : inputValue && !disabled ? (
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    )}
                </div>

                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                        {suggestions.length > 0 ? (
                            suggestions.map((categoria) => (
                                <li
                                    key={categoria.id}
                                    onClick={() => handleSelect(categoria)}
                                    className={`px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between hover:bg-slate-50
                                        ${form[fieldId] === categoria.id ? 'bg-slate-100 font-bold' : ''}
                                    `}
                                >
                                    <span className="uppercase">{categoria.nombre}</span>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-slate-400 text-xs text-center italic">No se encontraron categorías</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CategoriaPlatoSearchSelect;