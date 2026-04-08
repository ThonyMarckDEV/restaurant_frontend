import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/proveedorService'; 
import { MagnifyingGlassIcon, BuildingOfficeIcon, IdentificationIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProveedorSearchSelect = ({ form, setForm, disabled, isFilter = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    // Sincronizar el input si el form cambia desde afuera (ej: al editar)
    useEffect(() => {
        if (form && form.proveedorNombre) {
            setInputValue(form.proveedorNombre);
        } else if (form && !form.proveedor_id) {
            setInputValue('');
        }
    }, [form]);

    // Cerrar sugerencias al hacer clic afuera del componente
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchProveedores = async (searchTerm = '') => {
        setLoading(true);
        try {
            // Siempre buscamos proveedores activos (estado: 1)
            const queryParams = { search: searchTerm, estado: '1' };
            const response = await index(1, queryParams);
            const lista = response.data || [];
            setSuggestions(lista);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error al buscar proveedores", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);

        // Si ya había algo seleccionado y el usuario escribe, limpiamos el ID seleccionado
        if (form.proveedor_id) {
            setForm(prev => ({ ...prev, proveedor_id: '', proveedorNombre: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        // Debounce para no saturar la API
        debounceRef.current = setTimeout(() => {
            fetchProveedores(texto);
        }, 500);
    };

    const handleInputClick = () => {
        if (!showSuggestions && !disabled) {
            if (suggestions.length === 0) {
                fetchProveedores('');
            } else {
                setShowSuggestions(true);
            }
        }
    };

    const handleSelect = (proveedor) => {
        setInputValue(proveedor.razon_social);
        setForm(prev => ({ 
            ...prev, 
            proveedor_id: proveedor.id, 
            proveedorNombre: proveedor.razon_social 
        }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, proveedor_id: '', proveedorNombre: '' }));
        fetchProveedores('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {!isFilter && (
                <label className="block text-sm font-black text-slate-700 uppercase mb-2">
                    Proveedor <span className="text-red-500">*</span>
                </label>
            )}
            
            <div className="relative flex items-center group">

                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todos los proveedores" : "Ej: Distribuidora S.A.C."}
                    className={`w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-3'} 
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                    autoComplete="off"
                />

                {/* Icono izquierdo (Edificio) */}
                <div className="absolute left-3 text-slate-400">
                    <BuildingOfficeIcon className="w-4 h-4" />
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
                            suggestions.map((proveedor) => (
                                <li
                                    key={proveedor.id}
                                    onClick={() => handleSelect(proveedor)}
                                    className={`px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between transition-colors ${
                                        form.proveedor_id === proveedor.id 
                                        ? 'bg-slate-100 text-black font-bold' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-black'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold flex items-center gap-1">
                                            {proveedor.razon_social}
                                        </span>
                                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                            <IdentificationIcon className="w-3 h-3" /> RUC: {proveedor.ruc}
                                        </span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-slate-400 text-xs text-center italic">
                                {loading ? 'Buscando...' : 'No se encontraron proveedores'}
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {!isFilter && (
                <div className="mt-2 text-xs h-4">
                    {form.proveedor_id ? (
                        <span className="text-green-600 font-bold flex items-center gap-1 animate-pulse">
                            ✓ Seleccionado: {form.proveedorNombre}
                        </span>
                    ) : (
                        <span className="text-gray-400 italic">
                            {inputValue && !loading ? 'Selecciona una opción de la lista' : 'Busca y selecciona un proveedor'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProveedorSearchSelect;