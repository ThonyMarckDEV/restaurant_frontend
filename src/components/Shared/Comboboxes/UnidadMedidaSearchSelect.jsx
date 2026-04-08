import React, { useState, useEffect, useRef } from 'react';
// Asegúrate de que la ruta del servicio sea correcta en tu proyecto
import { index } from 'services/unidadMedidaService'; 
import { MagnifyingGlassIcon, ScaleIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UnidadMedidaSearchSelect = ({ 
    form, 
    setForm, 
    disabled, 
    isFilter = false,
    // Agregamos valores por defecto para que no rompa si no los pasas
    idField = 'unidad_medida_id', 
    nameField = 'unidadMedidaNombre' 
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    // 1. Sincronizar usando los campos dinámicos
    useEffect(() => {
        if (form && form[nameField]) {
            setInputValue(form[nameField]);
        } else if (form && !form[idField]) {
            setInputValue('');
        }
    }, [form, nameField, idField]); // Dependencias correctas

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchUnidades = async (searchTerm = '') => {
        setLoading(true);
        try {
            const queryParams = isFilter ? { search: searchTerm } : { search: searchTerm, estado: '1' };
            const response = await index(1, queryParams);
            const lista = response.data || [];
            setSuggestions(lista);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error al buscar unidades de medida", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);

        // 2. Limpiamos dinámicamente
        if (form[idField]) {
            setForm(prev => ({ ...prev, [idField]: '', [nameField]: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
            fetchUnidades(texto);
        }, 500);
    };

    const handleInputClick = () => {
        if (!showSuggestions && !disabled) {
            if (suggestions.length === 0) {
                fetchUnidades('');
            } else {
                setShowSuggestions(true);
            }
        }
    };

    // 3. Guardamos dinámicamente
    const handleSelect = (unidad) => {
        setInputValue(unidad.nombre);
        setForm(prev => ({ 
            ...prev, 
            [idField]: unidad.id, 
            [nameField]: unidad.nombre 
        }));
        setShowSuggestions(false);
    };

    // 4. Limpiamos dinámicamente
    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, [idField]: '', [nameField]: '' }));
        fetchUnidades('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {/* OJO: Quité el label de aquí porque en InsumoForm ya le pusiste labels propios */}
            
            <div className="relative flex items-center group">

                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todas las unidades" : "Ej: Kilogramo, Litro..."}
                    className={`w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-3'} 
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                    autoComplete="off"
                />

                <div className="absolute left-3 text-slate-400">
                    <ScaleIcon className="w-4 h-4" />
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
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl animate-in fade-in zoom-in duration-100">
                        {suggestions.length > 0 ? (
                            suggestions.map((unidad) => (
                                <li
                                    key={unidad.id}
                                    onClick={() => handleSelect(unidad)}
                                    className={`px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between transition-colors ${
                                        // 5. Comparamos dinámicamente
                                        form[idField] === unidad.id 
                                        ? 'bg-slate-100 text-black font-bold' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-black'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <TagIcon className="w-4 h-4 opacity-50" />
                                        {unidad.nombre}
                                    </div>
                                    <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                        {unidad.abreviatura}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-slate-400 text-xs text-center italic">
                                {loading ? 'Buscando...' : 'No se encontraron unidades'}
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {!isFilter && (
                <div className="mt-2 text-xs h-4">
                    {/* 6. Mostramos el mensaje dinámicamente */}
                    {form[idField] ? (
                        <span className="text-green-600 font-bold flex items-center gap-1 animate-pulse">
                            ✓ Seleccionado: {form[nameField]}
                        </span>
                    ) : (
                        <span className="text-gray-400 italic">
                            {inputValue && !loading ? 'Selecciona una opción de la lista' : 'Busca y selecciona una unidad'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default UnidadMedidaSearchSelect;