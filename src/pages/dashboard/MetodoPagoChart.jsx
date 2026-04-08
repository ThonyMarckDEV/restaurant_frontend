import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const MetodoPagoChart = ({ datos }) => {
    const ref   = useRef(null);
    const chart = useRef(null);

    useEffect(() => {
        if (!datos || !ref.current) return;
        if (chart.current) chart.current.destroy();

        chart.current = new Chart(ref.current, {
            type: 'doughnut',
            data: {
                labels: datos.map(d => d.metodo),
                datasets: [{
                    data: datos.map(d => d.total),
                    backgroundColor: COLORS.slice(0, datos.length),
                    borderWidth: 0,
                    hoverOffset: 8,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: { legend: { display: false } },
            },
        });

        return () => { if (chart.current) chart.current.destroy(); };
    }, [datos]);

    const total = datos?.reduce((s, d) => s + d.total, 0) || 0;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 h-full">
            <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-3 md:mb-4">
                Método de pago
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
                            <div key={d.metodo} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                                    <span className="text-slate-600 font-medium truncate">{d.metodo}</span>
                                </div>
                                <div className="text-right shrink-0 ml-2">
                                    <span className="font-black text-slate-800">
                                        {total > 0 ? Math.round((d.total / total) * 100) : 0}%
                                    </span>
                                    <span className="text-slate-400 ml-1">S/{d.total.toFixed(0)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MetodoPagoChart;