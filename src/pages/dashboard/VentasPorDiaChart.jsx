import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const VentasPorDiaChart = ({ datos }) => {
    const ref = useRef(null);
    const chart = useRef(null);

    useEffect(() => {
        if (!datos || !ref.current) return;

        if (chart.current) chart.current.destroy();

        const labels   = datos.map(d => d.fecha);
        const totales  = datos.map(d => d.total);

        chart.current = new Chart(ref.current, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Ventas (S/)',
                    data: totales,
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    borderColor: 'rgba(99, 102, 241, 0.8)',
                    borderWidth: 2,
                    borderRadius: 6,
                    hoverBackgroundColor: 'rgba(99, 102, 241, 0.3)',
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` S/ ${ctx.parsed.y.toFixed(2)}`,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { 
                            font: { size: 11 },
                            autoSkip: true,
                            maxTicksLimit: 14,
                        },
                    },
                    y: {
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: {
                            font: { size: 11 },
                            callback: (v) => `S/ ${v.toLocaleString()}`,
                        },
                        beginAtZero: true,
                    },
                },
            },
        });

        return () => { if (chart.current) chart.current.destroy(); };
    }, [datos]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Ventas por día
            </p>
            {(!datos || datos.length === 0) ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                    Sin datos para el período
                </div>
            ) : (
                <div style={{ position: 'relative', height: '260px' }}>
                    <canvas ref={ref} />
                </div>
            )}
        </div>
    );
};

export default VentasPorDiaChart;