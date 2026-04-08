import React from 'react';
import { PlusCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const AdicionalForm = ({ form, setForm, handleChange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <PlusCircleIcon className="w-5 h-5" /> Datos del Adicional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Nombre */}
                <div className="md:col-span-8">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre del Adicional / Extra <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={form.nombre || ''}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none transition-all"
                        placeholder="Ej: Huevo frito, Porción de Arroz, Ají extra..."
                        required
                    />
                </div>

                {/* Precio */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-green-700 uppercase mb-1">
                        Precio <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <CurrencyDollarIcon className="w-4 h-4 absolute left-3 top-3 text-green-500"/>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.precio || ''}
                            onChange={(e) => handleChange('precio', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-green-300 rounded-lg focus:ring-1 focus:ring-green-500 outline-none bg-green-50"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdicionalForm;