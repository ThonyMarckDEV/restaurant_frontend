import React from 'react';

const CajaForm = ({ form, setForm, handleChange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 mb-4 uppercase border-b border-slate-100 pb-2">
                Datos Generales
            </h3>
            <div className="grid grid-cols-1 gap-5">

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text" 
                        value={form.nombre || ''}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-black"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        descripcion 
                    </label>
                    <textarea 
                        value={form.descripcion || ''}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-black resize-none"
                        rows="3"
                        
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default CajaForm;