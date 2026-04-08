import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { TrophyIcon } from '@heroicons/react/24/outline';

Chart.register(...registerables);

const BAR_COLORS = [
    'rgba(99,102,241,0.8)',
    'rgba(16,185,129,0.8)',
    'rgba(245,158,11,0.8)',
    'rgba(239,68,68,0.8)',
    'rgba(139,92,246,0.8)',
];

const TopProductos = ({ datos }) => {
    const ref   = useRef(null);
    const chart = useRef(null);

    useEffect(() => {
        // Guard completo antes de cualquier acceso a datos
        if (!datos || datos.length === 0 || !ref.current) return;
        if (chart.current) chart.current.destroy();

        chart.current = new Chart(ref.current, {
            type: 'bar',
            data: {
                labels: datos.map(d =>
                    d.nombre.length > 16 ? d.nombre.slice(0, 14) + '…' : d.nombre
                ),
                datasets: [{
                    label: 'Unidades vendidas',
                    data: datos.map(d => d.total_vendido),
                    backgroundColor: BAR_COLORS.slice(0, datos.length),
                    borderRadius: 6,
                    borderWidth: 0,
                }],
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        beginAtZero: true,
                        ticks: { font: { size: 10 }, stepSize: 1 },
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } },
                    },
                },
            },
        });

        return () => {
            if (chart.current) { chart.current.destroy(); chart.current = null; }
        };
    }, [datos]);

    const altura = Math.max(160, Math.min((datos?.length || 5) * 40 + 40, 320));

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 h-full">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
                <TrophyIcon className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">
                    Top vendidos
                </p>
            </div>

            {(!datos || datos.length === 0) ? (
                <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                    Sin datos para el período
                </div>
            ) : (
                <div style={{ position: 'relative', height: `${altura}px` }}>
                    <canvas ref={ref} />
                </div>
            )}
        </div>
    );
};

export default TopProductos;