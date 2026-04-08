import React from 'react';
import { 
    BuildingOfficeIcon, 
    IdentificationIcon, 
    UserIcon, 
    PhoneIcon, 
    EnvelopeIcon, 
    MapPinIcon 
} from '@heroicons/react/24/outline';

import { onlyNumbers, onlyLetters } from 'utilities/Validations/validations'; 

const ProveedorForm = ({ form, handleChange }) => {
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <BuildingOfficeIcon className="w-5 h-5" /> Datos del Proveedor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* RUC */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        RUC <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <IdentificationIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            value={form.ruc || ''}
                            onChange={(e) => handleChange('ruc', onlyNumbers(e.target.value, 11))}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="11 dígitos"
                            required
                        />
                    </div>
                </div>

                {/* Razón Social */}
                <div className="md:col-span-8">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Razón Social <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <BuildingOfficeIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            value={form.razon_social || ''}
                            onChange={(e) => handleChange('razon_social', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Nombre de la Empresa S.A.C."
                            required
                        />
                    </div>
                </div>
                <div className="md:col-span-12">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nombre de Contacto (Opcional)
                    </label>
                    <div className="relative">
                        <UserIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            value={form.nombre_contacto || ''}
                            onChange={(e) => handleChange('nombre_contacto', onlyLetters(e.target.value))}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Ej: Juan Pérez"
                        />
                    </div>
                </div>

                {/* Teléfono */}
                <div className="md:col-span-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Teléfono (Opcional)
                    </label>
                    <div className="relative">
                        <PhoneIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            value={form.telefono || ''}
                            onChange={(e) => handleChange('telefono', onlyNumbers(e.target.value, 9))}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="999888777"
                        />
                    </div>
                </div>

                {/* Correo */}
                <div className="md:col-span-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Correo Electrónico (Opcional)
                    </label>
                    <div className="relative">
                        <EnvelopeIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="email"
                            value={form.correo || ''}
                            onChange={(e) => handleChange('correo', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="ventas@empresa.com"
                        />
                    </div>
                </div>

                {/* Dirección */}
                <div className="md:col-span-12">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Dirección (Opcional)
                    </label>
                    <div className="relative">
                        <MapPinIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            value={form.direccion || ''}
                            onChange={(e) => handleChange('direccion', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Av. Principal 123..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProveedorForm;