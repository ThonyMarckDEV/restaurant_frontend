import React from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const DetalleMovimientosModal = ({ isOpen, onClose, viewData, viewLoading }) => {
    return (
        <ViewModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Detalle de Movimientos en Caja" 
            isLoading={viewLoading} 
            maxWidth="max-w-3xl"
        >
            {viewData && (
                <div className="space-y-4">
                    {/* Header del Turno */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                            <h3 className="font-black text-slate-800 uppercase">{viewData.caja?.nombre}</h3>
                            <p className="text-xs text-slate-500 uppercase">Cajero: {viewData.usuario?.datos_empleado?.nombre || 'Admin'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Saldo Esperado</p>
                            <p className="text-xl font-black text-blue-600">S/ {parseFloat(viewData.saldo_esperado).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Tabla de Movimientos */}
                    <div className="max-h-[50vh] overflow-y-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 text-xs uppercase text-slate-500 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Hora</th>
                                    <th className="px-4 py-3">Tipo / Categoría</th>
                                    <th className="px-4 py-3">Motivo</th>
                                    <th className="px-4 py-3 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {viewData.movimientos?.length > 0 ? (
                                    viewData.movimientos.map((mov) => (
                                        <tr key={mov.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-[10px] text-slate-500 font-mono">
                                                {new Date(mov.created_at).toLocaleTimeString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase ${mov.tipo === 'ingreso' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {mov.tipo === 'ingreso' ? <ArrowDownIcon className="w-3 h-3"/> : <ArrowUpIcon className="w-3 h-3"/>}
                                                    {mov.categoria}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-600">
                                                {mov.motivo}
                                            </td>
                                            <td className={`px-4 py-3 text-right font-black font-mono ${mov.tipo === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {mov.tipo === 'ingreso' ? '+' : '-'} S/ {parseFloat(mov.monto).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-slate-400 text-xs italic">
                                            No hay movimientos registrados en este turno.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </ViewModal>
    );
};

export default DetalleMovimientosModal;