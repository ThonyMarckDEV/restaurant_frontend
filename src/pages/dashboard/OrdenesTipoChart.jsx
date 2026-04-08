import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

const OrdenesTipoChart = ({ datos }) => {
    const ref   = useRef(null);
    const chart = useRef(null);

    useEffect(() => {
        // Guard completo antes de cualquier acceso a datos
        if (!datos || datos.length === 0 || !ref.current) return;
        if (chart.current) chart.current.destroy();

        chart.current = new Chart(ref.current, {
            type: 'pie',
            data: {
                labels: datos.map(d => d.tipo),
                datasets: [{
                    data: datos.map(d => d.cantidad),
                    backgroundColor: COLORS.slice(0, datos.length),
                    borderWidth: 0,
                    hoverOffset: 6,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
            },
        });

        return () => {
            if (chart.current) { chart.current.destroy(); chart.current = null; }
        };
    }, [datos]);

    const total = datos?.reduce((s, d) => s + d.cantidad, 0) || 0;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 h-full">
            <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-3 md:mb-4">
                Órdenes por tipo
            </p>

            {(!datos || datos.length === 0) ? (
                <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Sin datos</div>
            ) : (
                <>
                    <div style={{ position: 'relative', height: '160px' }}>
                        <canvas ref={ref} />
                    </div>
                    <div className="mt-3 space-y-1.5">
                        {datos.map((d, i) => (
                            <div key={d.tipo} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                                    <span className="text-slate-600 font-medium truncate">{d.tipo}</span>
                                </div>
                                <span className="font-black text-slate-800 shrink-0 ml-2">
                                    {d.cantidad}
                                    <span className="text-slate-400 font-normal ml-1">
                                        ({total > 0 ? Math.round((d.cantidad / total) * 100) : 0}%)
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default OrdenesTipoChart;