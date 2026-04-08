import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const METODO_BADGE = {
    'Efectivo':  'bg-emerald-50 text-emerald-700',
    'Tarjeta':   'bg-indigo-50 text-indigo-700',
    'Yape/Plin': 'bg-violet-50 text-violet-700',
};

const ActividadReciente = ({ datos }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Últimas ventas
            </p>
        </div>

        {(!datos || datos.length === 0) ? (
            <p className="text-sm text-slate-400 text-center py-8">Sin actividad reciente</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {['Código', 'Mesa', 'Total', 'Método', 'Cajero', 'Hora'].map(h => (
                                <th key={h} className="text-left text-slate-400 font-bold uppercase tracking-wider pb-2 pr-4 whitespace-nowrap">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {datos.map((v) => (
                            <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-2.5 pr-4 font-mono font-bold text-slate-700">{v.codigo}</td>
                                <td className="py-2.5 pr-4 text-slate-600">
                                    {v.mesa
                                        ? `Mesa ${v.mesa}`
                                        : <span className="text-slate-400 italic">Llevar</span>
                                    }
                                </td>
                                <td className="py-2.5 pr-4 font-black text-slate-800">
                                    S/ {v.total.toFixed(2)}
                                </td>
                                <td className="py-2.5 pr-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${METODO_BADGE[v.metodo] || 'bg-slate-100 text-slate-600'}`}>
                                        {v.metodo}
                                    </span>
                                </td>
                                <td className="py-2.5 pr-4 text-slate-600">{v.cajero}</td>
                                <td className="py-2.5 text-slate-400 whitespace-nowrap">
                                    {new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export default ActividadReciente;