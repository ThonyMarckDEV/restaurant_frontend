import React from 'react';
import { CubeIcon } from '@heroicons/react/24/outline';

const OPERACION_STYLE = {
    'Ingreso': 'bg-emerald-50 text-emerald-700',
    'Salida':  'bg-rose-50 text-rose-700',
};

const MovimientosKardex = ({ datos }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
            <CubeIcon className="w-4 h-4 text-violet-500" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Movimientos de almacén
            </p>
        </div>

        {(!datos || datos.length === 0) ? (
            <p className="text-sm text-slate-400 text-center py-8">Sin movimientos en el período</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="text-left text-slate-400 font-bold uppercase tracking-wider pb-2 pr-3">Movimiento</th>
                            <th className="text-left text-slate-400 font-bold uppercase tracking-wider pb-2 pr-3">Op.</th>
                            <th className="text-left text-slate-400 font-bold uppercase tracking-wider pb-2 pr-3">Insumo</th>
                            <th className="text-left text-slate-400 font-bold uppercase tracking-wider pb-2 pr-3">Almacén</th>
                            <th className="text-right text-slate-400 font-bold uppercase tracking-wider pb-2 pr-3">Cant.</th>
                            <th className="text-right text-slate-400 font-bold uppercase tracking-wider pb-2">Saldo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {datos.map((d, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="py-2.5 pr-3 font-semibold text-slate-700 whitespace-nowrap">
                                    {d.movimiento}
                                </td>
                                <td className="py-2.5 pr-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${OPERACION_STYLE[d.operacion] || 'bg-slate-100 text-slate-600'}`}>
                                        {d.operacion}
                                    </span>
                                </td>
                                <td className="py-2.5 pr-3 text-slate-700 max-w-[140px] truncate" title={d.insumo}>
                                    {d.insumo}
                                </td>
                                <td className="py-2.5 pr-3 text-slate-500 whitespace-nowrap">
                                    {d.almacen}
                                </td>
                                <td className="py-2.5 pr-3 text-right font-black text-slate-800">
                                    {Number(d.cantidad).toLocaleString('es-PE', { maximumFractionDigits: 2 })}
                                </td>
                                <td className="py-2.5 text-right text-slate-500">
                                    {Number(d.saldo).toLocaleString('es-PE', { maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export default MovimientosKardex;