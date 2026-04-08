import React from 'react';
import { HomeModernIcon, TagIcon } from '@heroicons/react/24/outline';

const TIPOS_ALMACEN = [
    { value: 1, label: 'PRINCIPAL (Ingreso de Compras)', color: 'text-amber-600' },
    { value: 2, label: 'SECUNDARIO (Respaldo)', color: 'text-slate-600' },
    { value: 3, label: 'PRODUCCIÓN (Cocina)', color: 'text-orange-600' },
    { value: 4, label: 'VENTA (Frigobar/Vitrina)', color: 'text-blue-600' },
];

const AlmacenForm = ({ form, handleChange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <HomeModernIcon className="w-5 h-5" /> Configuración de Almacén
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nombre */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre del almacén <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={form.nombre || ''}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                        placeholder="Ej: Almacén Central, Cocina, Barra..."
                        required
                    />
                </div>

                {/* Tipo de Almacén */}
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Almacén <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <TagIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <select
                            value={form.tipo || 2}
                            onChange={(e) => handleChange('tipo', parseInt(e.target.value))}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none appearance-none bg-white"
                            required
                        >
                            {TIPOS_ALMACEN.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-[11px] text-blue-700 leading-relaxed">
                    <strong>Nota:</strong> Si seleccionas <strong>PRINCIPAL</strong>, cualquier otro almacén que fuera principal pasará automáticamente a ser <strong>SECUNDARIO</strong>.
                </p>
            </div>
        </div>
    );
};

export default AlmacenForm;