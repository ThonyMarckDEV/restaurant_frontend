import React from 'react';
import { BeakerIcon, BanknotesIcon, ArchiveBoxIcon, ArrowsRightLeftIcon, ShoppingCartIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import UnidadMedidaSearchSelect from 'components/Shared/Comboboxes/UnidadMedidaSearchSelect';

const InsumoForm = ({ form, setForm, handleChange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <BeakerIcon className="w-5 h-5" /> Información del Insumo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* CONFIGURACIÓN DE TIPO DE ÍTEM */}
                <div className="md:col-span-12 flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={form.es_inventariable} 
                            onChange={(e) => handleChange('es_inventariable', e.target.checked)}
                            className="w-5 h-5 accent-black cursor-pointer"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800 flex items-center gap-1 uppercase group-hover:text-black transition-colors">
                                <ArchiveBoxIcon className="w-4 h-4"/> Controlar Stock (Almacén)
                            </span>
                            <span className="text-[10px] text-slate-500">¿Entra y sale de inventario?</span>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group sm:ml-6 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
                        <input 
                            type="checkbox" 
                            checked={form.es_venta_directa} 
                            onChange={(e) => handleChange('es_venta_directa', e.target.checked)}
                            className="w-5 h-5 accent-black cursor-pointer"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800 flex items-center gap-1 uppercase group-hover:text-black transition-colors">
                                <ShoppingCartIcon className="w-4 h-4"/> Venta Directa (POS)
                            </span>
                            <span className="text-[10px] text-slate-500">¿Se vende en caja al cliente?</span>
                        </div>
                    </label>
                </div>

                {/* Nombre del Insumo */}
                <div className="md:col-span-12">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nombre del Insumo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.nombre || ''}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                        placeholder="Ej: Cerveza Pilsen, Arroz Superior..."
                        required
                    />
                </div>

                {/* Unidad de Compra (Almacén) */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Unidad de Compra <span className="text-red-500">*</span>
                    </label>
                    <UnidadMedidaSearchSelect 
                        form={form} 
                        setForm={setForm} 
                        idField="unidad_compra_id" 
                        nameField="unidadCompraNombre" 
                    />
                </div>

                {/* Factor de Conversión */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Factor de Conversión <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <ArrowsRightLeftIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={form.factor_conversion || ''}
                            onChange={(e) => handleChange('factor_conversion', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Ej: 6, 12, 50..."
                            required
                        />
                    </div>
                </div>

                {/* Unidad de Consumo (Cocina) */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Unidad de Consumo <span className="text-red-500">*</span>
                    </label>
                    <UnidadMedidaSearchSelect 
                        form={form} 
                        setForm={setForm} 
                        idField="unidad_medida_id" 
                        nameField="unidadMedidaNombre" 
                    />
                </div>

                {/* Mensaje de ayuda dinámico */}
                {form.unidadCompraNombre && form.unidadMedidaNombre && form.factor_conversion && (
                    <div className="md:col-span-12 bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg text-xs font-bold flex items-center gap-2">
                        <ArrowsRightLeftIcon className="w-4 h-4 shrink-0" />
                        Al comprar 1 {form.unidadCompraNombre}, ingresarán {form.factor_conversion} {form.unidadMedidaNombre} al stock.
                    </div>
                )}

                {/* COSTO REFERENCIAL: Ajustado con el cálculo dinámico */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Costo Compra (por {form.unidadCompraNombre || 'Caja/Saco'})
                    </label>
                    <div className="relative">
                        <BanknotesIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="number"
                            step="0.01"
                            value={form.costo_referencial || ''}
                            onChange={(e) => handleChange('costo_referencial', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="0.00"
                        />
                    </div>
                    {/* CÁLCULO EN VIVO */}
                    {form.costo_referencial && form.factor_conversion && parseFloat(form.factor_conversion) > 1 && (
                        <p className="text-[10px] text-blue-600 font-bold mt-1.5 flex items-center gap-1 bg-blue-50 p-1.5 rounded border border-blue-100">
                            <span>ℹ️ Costo real: </span> 
                            <span className="text-black">
                                S/ {(parseFloat(form.costo_referencial) / parseFloat(form.factor_conversion)).toFixed(2)}
                            </span> 
                            <span>por {form.unidadMedidaNombre || 'Unidad'}</span>
                        </p>
                    )}
                </div>

               {/* Precio Venta (Muestra condicionalmente) */}
                {form.es_venta_directa && (
                    <div className="md:col-span-8 animate-in fade-in zoom-in duration-200">
                        <label className="block text-xs font-bold text-green-700 uppercase mb-1">
                            Precio Venta (por {form.unidadMedidaNombre || 'Unidad'}) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <BuildingStorefrontIcon className="w-4 h-4 absolute left-3 top-3 text-green-500"/>
                            <input
                                type="number"
                                step="0.01"
                                value={form.precio_venta || ''}
                                onChange={(e) => handleChange('precio_venta', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm border border-green-300 rounded-lg focus:ring-1 focus:ring-green-500 outline-none bg-green-50"
                                placeholder="0.00"
                                required={form.es_venta_directa}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsumoForm;