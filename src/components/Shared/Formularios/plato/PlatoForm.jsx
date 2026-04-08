import React from 'react';
import { FireIcon, CurrencyDollarIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import CategoriaPlatoSearchSelect from 'components/Shared/Comboboxes/CategoriaPlatoSearchSelect';

const PlatoForm = ({ form, setForm, handleChange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <FireIcon className="w-5 h-5" /> Detalles del Plato
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Configuración de Menú */}
                <div className="md:col-span-12 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={form.es_para_menu} 
                            onChange={(e) => handleChange('es_para_menu', e.target.checked)}
                            className="w-5 h-5 accent-black cursor-pointer"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800 flex items-center gap-1 uppercase group-hover:text-black transition-colors">
                                <BookOpenIcon className="w-4 h-4"/> Opción para Menú
                            </span>
                            <span className="text-[10px] text-slate-500">¿Este plato puede ser elegido dentro de un combo/menú del día?</span>
                        </div>
                    </label>
                </div>

                {/* Nombre del Plato */}
                <div className="md:col-span-8">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nombre del Plato <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.nombre || ''}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                        placeholder="Ej: Lomo Saltado, Ceviche Clásico..."
                        required
                    />
                </div>

                {/* Precio Carta */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-green-700 uppercase mb-1">
                        Precio a la Carta <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <CurrencyDollarIcon className="w-4 h-4 absolute left-3 top-3 text-green-500"/>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.precio_carta || ''}
                            onChange={(e) => handleChange('precio_carta', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-green-300 rounded-lg focus:ring-1 focus:ring-green-500 outline-none bg-green-50"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                {/* Categoría */}
                <div className="md:col-span-12">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Categoría <span className="text-red-500">*</span>
                    </label>
                    <CategoriaPlatoSearchSelect 
                        form={form} 
                        setForm={setForm} 
                        fieldId="categoria_id" 
                        fieldNombre="categoria_nombre" 
                    />
                </div>
            </div>
        </div>
    );
};

export default PlatoForm;