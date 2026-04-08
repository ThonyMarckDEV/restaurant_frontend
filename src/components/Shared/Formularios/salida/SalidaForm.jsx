import React from 'react';
import AlmacenSearchSelect from 'components/Shared/Comboboxes/AlmacenSearchSelect';
import InsumoSearchSelect from 'components/Shared/Comboboxes/InsumoSearchSelect';
import { TrashIcon} from '@heroicons/react/24/outline';

const SalidaForm = ({ formData, setFormData, loading, handleChange, addItem, updateItem, removeItem, handleSubmit }) => {

    const handleCantidadChange = (index, value, stockDisponible) => {
        if (value === '') { updateItem(index, 'cantidad', ''); return; }
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
                    <h3 className="font-black uppercase text-sm border-b pb-2">Configuración de Salida</h3>
                    
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Tipo de Salida</label>
                        <select 
                            value={formData.tipo_movimiento}
                            onChange={(e) => handleChange('tipo_movimiento', e.target.value)}
                            className="w-full p-2.5 text-sm border rounded-lg font-bold focus:ring-1 focus:ring-black outline-none"
                        >
                            <option value={3}>Consumo Cocina</option>
                            <option value={5}>Merma</option>
                            <option value={6}>Ajuste de Inventario</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Almacén de Origen</label>
                        <AlmacenSearchSelect form={formData} setForm={setFormData} />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Observaciones</label>
                        <textarea 
                            className="w-full p-2.5 text-sm border rounded-lg outline-none focus:ring-1 focus:ring-black"
                            rows="3" value={formData.observacion}
                            onChange={(e) => handleChange('observacion', e.target.value)}
                            placeholder="Describa el motivo de la salida..."
                        />
                    </div>

                    <button 
                        type="submit" disabled={loading || !formData.almacen_id}
                        className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:opacity-30"
                    >
                        {loading ? 'Procesando...' : 'Registrar Salida'}
                    </button>
                </div>
            </div>

            <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
                <h3 className="font-black uppercase text-sm border-b pb-2 mb-4">Insumos a Retirar</h3>
                <InsumoSearchSelect onSelect={addItem} isTraspaso={true} almacenId={formData.almacen_id} />

                <div className="mt-6 overflow-x-auto overflow-y-auto max-h-[450px]">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500">
                            <tr>
                                <th className="px-4 py-3 w-10 text-center">#</th>
                                <th className="px-4 py-3">Insumo</th>
                                <th className="px-4 py-3 w-44">Cantidad a Retirar</th>
                                <th className="px-4 py-3 w-10 text-right pr-6">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {formData.items.map((item, index) => {
                                const stockMax = parseFloat(item.insumo_original?.stock_actual || 0);
                                return (
                                    <tr key={item.insumo_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-center font-bold text-slate-400">{index + 1}</td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold uppercase text-xs text-slate-800">{item.nombre}</p>
                                            <p className={`text-[10px] font-bold ${stockMax > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                En Almacén: {Number(stockMax)} {item.abreviatura}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="number" step="0.01" value={item.cantidad}
                                                        onChange={(e) => handleCantidadChange(index, e.target.value, stockMax)}
                                                        className="w-24 p-2 border border-slate-300 rounded-lg text-center font-black focus:ring-1 focus:ring-black outline-none"
                                                    />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">{item.abreviatura}</span>
                                                </div>
                                                {parseFloat(item.cantidad) >= stockMax && stockMax > 0 && (
                                                    <span className="text-[9px] text-orange-500 font-bold uppercase">Máximo alcanzado</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right pr-6">
                                            <button type="button" onClick={() => removeItem(index)} className="text-slate-300 hover:text-red-500 transition-all"><TrashIcon className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </form>
    );
};
export default SalidaForm;