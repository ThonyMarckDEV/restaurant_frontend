import React from 'react';
import ProveedorSearchSelect from 'components/Shared/Comboboxes/ProveedorSearchSelect';
import InsumoSearchSelect from 'components/Shared/Comboboxes/InsumoSearchSelect';
import { TrashIcon, BanknotesIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const CompraForm = ({ 
    formData, 
    setFormData, 
    loading, 
    handleChange, 
    addDetalle, 
    updateDetalle, 
    removeDetalle, 
    totales, 
    handleSubmit 
}) => {
    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            
            {/* --- CABECERA --- */}
            <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                    <h3 className="font-black uppercase text-sm border-b pb-2">Datos del Comprobante</h3>
                    
                    <ProveedorSearchSelect form={formData} setForm={setFormData} />
                    
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Tipo Doc.</label>
                        <select 
                            value={formData.tipo_comprobante} 
                            onChange={(e) => handleChange('tipo_comprobante', e.target.value)} 
                            className="w-full p-2.5 text-sm border rounded-lg focus:ring-1 focus:ring-black outline-none"
                        >
                            <option>Factura</option>
                            <option>Boleta</option>
                            <option>Nota de Venta</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Serie</label>
                            <input 
                                type="text" 
                                value={formData.serie_comprobante} 
                                onChange={(e) => handleChange('serie_comprobante', e.target.value)} 
                                className="w-full p-2.5 text-sm border rounded-lg uppercase" 
                                placeholder="F001" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Número</label>
                            <input 
                                type="text" 
                                value={formData.num_comprobante} 
                                onChange={(e) => handleChange('num_comprobante', e.target.value)} 
                                className="w-full p-2.5 text-sm border rounded-lg" 
                                placeholder="000123" 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Fecha</label>
                        <input 
                            type="date" 
                            value={formData.fecha_compra} 
                            onChange={(e) => handleChange('fecha_compra', e.target.value)} 
                            className="w-full p-2.5 text-sm border rounded-lg" 
                            required 
                        />
                    </div>
                </div>

                <div className="bg-black text-white p-6 rounded-xl shadow-xl">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold uppercase opacity-70">Total a Pagar</span>
                        <BanknotesIcon className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-4xl font-black mt-2">S/ {totales.total}</p>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full mt-6 bg-green-500 hover:bg-green-600 py-3 rounded-lg font-black uppercase transition-all disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : 'Finalizar Compra'}
                    </button>
                </div>
            </div>

            {/* --- DETALLES --- */}
            <div className="lg:col-span-8 space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
                    <h3 className="font-black uppercase text-sm border-b pb-2 mb-4">Detalle de Productos</h3>
                    
                    <InsumoSearchSelect onSelect={addDetalle} isCompra={true}  />

                    <div className="mt-6 overflow-x-auto overflow-y-auto max-h-[500px]">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] uppercase font-black text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Ítem / Insumo</th>
                                    <th className="px-4 py-3 w-40">Cantidad</th>
                                    <th className="px-4 py-3 w-32">P. Unit</th>
                                    <th className="px-4 py-3">Subtotal</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y">
                                {formData.detalles.map((det, index) => (
                                    <tr key={det.insumo_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <p className="font-bold uppercase text-xs text-slate-800 leading-tight">{det.nombre}</p>
                                            
                                            {/* CONVERSIÓN INFORMATIVA */}
                                            <div className="mt-1 flex flex-col gap-0.5">
                                                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 italic">
                                                    <ArrowsRightLeftIcon className="w-3 h-3" /> 
                                                    {/* Accedemos a los nombres reales */}
                                                    1 {det.unidad_compra} = {Number(det.factor_conversion)} {det.insumo_original?.unidad_medida?.nombre}
                                                </p>
                                                
                                                {det.cantidad > 0 && (
                                                    <p className="text-[9px] font-black text-blue-600 uppercase">
                                                        {/* Usamos la abreviatura (und, kg, etc.) */}
                                                        Total Almacén: {Number(det.cantidad * det.factor_conversion)} {det.insumo_original?.unidad_medida?.abreviatura}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="number" 
                                                    step="0.01" 
                                                    value={det.cantidad} 
                                                    onChange={(e) => updateDetalle(index, 'cantidad', e.target.value)} 
                                                    className="w-20 p-1.5 border border-slate-300 rounded text-center font-bold focus:ring-1 focus:ring-black outline-none" 
                                                    required
                                                />
                                                <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                                    {det.unidad_compra || 'UND'}
                                                </span>
                                            </div>
                                        </td>
                                        
                                        <td className="px-4 py-4 font-mono">
                                            <div className="flex items-center gap-1">
                                                <span className="text-slate-400">S/</span>
                                                <input 
                                                    type="number" 
                                                    step="0.01" 
                                                    value={det.precio_unitario} 
                                                    onChange={(e) => updateDetalle(index, 'precio_unitario', e.target.value)} 
                                                    className="w-20 p-1.5 border border-slate-300 rounded text-right focus:ring-1 focus:ring-black outline-none" 
                                                    required
                                                />
                                            </div>
                                        </td>
                                        
                                        <td className="px-4 py-4 font-black text-slate-700 font-mono text-sm">
                                            S/ {parseFloat(det.subtotal || 0).toFixed(2)}
                                        </td>
                                        
                                        <td className="px-4 py-4 text-center">
                                            <button 
                                                type="button" 
                                                onClick={() => removeDetalle(index)} 
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                
                                {formData.detalles.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-20 text-slate-400 italic text-sm">
                                            No has agregado ítems a esta compra. Utiliza el buscador de arriba.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CompraForm;