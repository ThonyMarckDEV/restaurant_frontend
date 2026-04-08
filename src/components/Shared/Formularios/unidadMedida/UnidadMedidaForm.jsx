import React from 'react';
import { ScaleIcon, TagIcon } from '@heroicons/react/24/outline';

const UnidadMedidaForm = ({ form, handleChange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <ScaleIcon className="w-5 h-5" /> Detalles de la Unidad
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Nombre */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nombre de la Unidad <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <ScaleIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre || ''}
                            onChange={(e) => handleChange('nombre', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Ej: Kilogramo, Litro, Unidad..."
                            required
                        />
                    </div>
                </div>

                {/* Abreviatura */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Abreviatura <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <TagIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            name="abreviatura"
                            value={form.abreviatura || ''}
                            onChange={(e) => handleChange('abreviatura', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Ej: kg, L, und..."
                            maxLength={10}
                            required
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UnidadMedidaForm;