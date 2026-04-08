import React, { useEffect } from 'react';
import AlmacenSearchSelect from 'components/Shared/Comboboxes/AlmacenSearchSelect';
import InsumoSearchSelect from 'components/Shared/Comboboxes/InsumoSearchSelect';
import { TrashIcon, ArrowsRightLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const TraspasoForm = ({ formData, setFormData, loading, handleChange, addItem, updateItem, removeItem, handleSubmit }) => {

    useEffect(() => {
        if (formData?.almacen_origen_id && formData?.items?.length > 0) {
            setFormData(prev => ({
                ...prev,
                items: []
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData?.almacen_origen_id]); 

    const handleCantidadChange = (index, value, stockDisponible) => {
        if (value === '') {
            updateItem(index, 'cantidad', '');
            return;
        }

        const max = parseFloat(stockDisponible || 0);
        let cant = parseFloat(value);

        if (cant > max) cant = max;
        if (isNaN(cant) || cant < 0) cant = 0;

        updateItem(index, 'cantidad', cant);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                    <h3 className="font-black uppercase text-sm border-b pb-2">Ruta de Traspaso</h3>
                    
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Desde (Origen)</label>
                        <AlmacenSearchSelect 
                            form={formData} setForm={setFormData} 
                            fieldId="almacen_origen_id" fieldNombre="almacen_origen_nombre" 
                        />
                    </div>

                    <div className="flex justify-center py-2">
                        <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                            <ArrowsRightLeftIcon className="w-5 h-5 text-slate-400 rotate-90 lg:rotate-0" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Hacia (Destino)</label>
                        <AlmacenSearchSelect 
                            form={formData} setForm={setFormData} 
                            fieldId="almacen_destino_id" fieldNombre="almacen_destino_nombre" 
                        />
                        {formData?.almacen_origen_id && formData?.almacen_origen_id === formData?.almacen_destino_id && (
                            <p className="text-[9px] text-red-500 font-bold mt-1 uppercase flex items-center gap-1">
                                <ExclamationCircleIcon className="w-3 h-3"/> El destino no puede ser igual al origen
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Observaciones</label>
                        <textarea 
                            className="w-full p-2.5 text-sm border rounded-lg outline-none focus:ring-1 focus:ring-black"
                            rows="3" value={formData?.observacion || ''}
                            onChange={(e) => handleChange('observacion', e.target.value)}
                            placeholder="Motivo del movimiento..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !formData?.almacen_origen_id || !formData?.almacen_destino_id || formData?.almacen_origen_id === formData?.almacen_destino_id}
                        className="w-full bg-black text-white py-4 rounded-xl font-black uppercase hover:bg-zinc-800 transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Traspaso'}
                    </button>
                </div>
            </div>

            <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
                <h3 className="font-black uppercase text-sm border-b pb-2 mb-4">Selección de Insumos</h3>
                
                <InsumoSearchSelect 
                    onSelect={addItem} 
                    isTraspaso={true} 
                    almacenId={formData?.almacen_origen_id} 
                />

                <div className="mt-6 overflow-x-auto overflow-y-auto max-h-[450px]">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500">
                            <tr>
                                <th className="px-4 py-3 w-10 text-center">#</th>
                                <th className="px-4 py-3">Insumo</th>
                                <th className="px-4 py-3 w-44">Cantidad a Enviar</th>
                                <th className="px-4 py-3 w-10 text-right pr-6">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {/* 🔥 El operador ?.map asegura que si items es undefined, no explote */}
                            {formData?.items?.map((item, index) => {
                                // Buscamos el stock_actual de forma segura
                                const stockMax = parseFloat(item?.insumo_original?.stock_actual || item?.stock_actual || 0);
                                return (
                                    <tr key={item.insumo_id || index} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-center font-bold text-slate-400">{index + 1}</td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold uppercase text-xs text-slate-800 leading-tight">{item?.nombre}</p>
                                            <p className={`text-[10px] font-bold mt-0.5 ${stockMax > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                Disponible: {Number(stockMax)} {item?.abreviatura || item?.unidad_medida?.abreviatura}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="number" 
                                                    step="0.01" 
                                                    value={item.cantidad}
                                                    onChange={(e) => handleCantidadChange(index, e.target.value, stockMax)}
                                                    className="w-24 p-2 border border-slate-300 rounded-lg text-center font-black focus:ring-1 focus:ring-black outline-none bg-white"
                                                    placeholder="0.00"
                                                />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item?.abreviatura || item?.unidad_medida?.abreviatura}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right pr-6">
                                            <button 
                                                type="button" 
                                                onClick={() => removeItem(index)} 
                                                className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            
                            {(!formData?.items || formData?.items?.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center">
                                        <p className="text-slate-400 italic text-sm">No has seleccionado insumos para traspasar.</p>
                                        <p className="text-[10px] text-slate-300 uppercase mt-1">Usa el buscador de arriba</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </form>
    );
};

export default TraspasoForm;