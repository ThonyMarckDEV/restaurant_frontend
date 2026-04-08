import React from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';

const UsuariosResumen = ({ datos }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
            <UsersIcon className="w-4 h-4 text-sky-500" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Usuarios por rol
            </p>
        </div>

        {(!datos || datos.length === 0) ? (
            <p className="text-sm text-slate-400 text-center py-8">Sin datos</p>
        ) : (
            <div className="space-y-4">
                {datos.map((d) => {
                    const pct = d.total > 0 ? Math.round((d.activos / d.total) * 100) : 0;
                    return (
                        <div key={d.rol}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                    {d.rol}
                                </span>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-emerald-600 font-black">
                                        {d.activos} activos
                                    </span>
                                    {d.inactivos > 0 && (
                                        <span className="text-slate-400">{d.inactivos} inactivos</span>
                                    )}
                                </div>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-sky-400 rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 text-right">
                                {pct}% activos · {d.total} en total
                            </p>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
);

export default UsuariosResumen;