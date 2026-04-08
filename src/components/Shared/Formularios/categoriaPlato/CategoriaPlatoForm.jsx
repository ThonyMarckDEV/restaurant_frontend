import React from 'react';
import { TagIcon } from '@heroicons/react/24/outline';

const CategoriaPlatoForm = ({ form, setForm, handleChange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <TagIcon className="w-5 h-5" /> Detalles de Categoría
            </h3>

            <div className="grid grid-cols-1 gap-5">
                {/* Nombre */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre de la Categoría <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={form.nombre || ''}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none transition-all"
                        placeholder="Ej: Entradas, Segundos, Postres, Bebidas..."
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoriaPlatoForm;