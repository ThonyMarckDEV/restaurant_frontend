import React from 'react';
import { ListBulletIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import MenuSearchSelect from 'components/Shared/Comboboxes/MenuSearchSelect';
import PlatoSearchSelect from 'components/Shared/Comboboxes/PlatoSearchSelect';

const MenuOpcionForm = ({ form, setForm, handleChange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <ListBulletIcon className="w-5 h-5" /> Asignar Plato a Menú
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Menú */}
                <div className="md:col-span-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Seleccionar Menú <span className="text-red-500">*</span>
                    </label>
                    <MenuSearchSelect form={form} setForm={setForm} fieldId="menu_id" fieldNombre="menu_nombre" />
                </div>

                {/* Plato */}
                <div className="md:col-span-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Seleccionar Plato <span className="text-red-500">*</span>
                    </label>
                    <PlatoSearchSelect form={form} setForm={setForm} fieldId="plato_id" fieldNombre="plato_nombre" />
                </div>

                {/* Disponible */}
                <div className="md:col-span-12 p-4 bg-slate-50 rounded-xl border border-slate-200 mt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={form.disponible} 
                            onChange={(e) => handleChange('disponible', e.target.checked)}
                            className="w-5 h-5 accent-black cursor-pointer"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800 flex items-center gap-1 uppercase group-hover:text-black transition-colors">
                                <CheckCircleIcon className="w-4 h-4 text-green-600"/> Disponible Hoy
                            </span>
                            <span className="text-[10px] text-slate-500">Desmarca esto si el plato se agotó y quieres que desaparezca temporalmente del menú.</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default MenuOpcionForm;