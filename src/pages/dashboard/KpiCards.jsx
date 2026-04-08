import React from 'react';
import {
    BanknotesIcon,
    ShoppingCartIcon,
    ArrowTrendingUpIcon,
    ClipboardDocumentListIcon,
    CubeIcon,
    ReceiptPercentIcon,
} from '@heroicons/react/24/outline';

const formatSol = (n) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(n ?? 0);

const formatNum = (n) =>
    new Intl.NumberFormat('es-PE').format(n ?? 0);

const KpiCard = ({ icon: Icon, label, value, sub, color }) => {
    const colors = {
        indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-100',  icon: 'text-indigo-500'  },
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'text-emerald-500' },
        amber:   { bg: 'bg-amber-50',   border: 'border-amber-100',   icon: 'text-amber-500'   },
        rose:    { bg: 'bg-rose-50',    border: 'border-rose-100',    icon: 'text-rose-500'    },
        sky:     { bg: 'bg-sky-50',     border: 'border-sky-100',     icon: 'text-sky-500'     },
        violet:  { bg: 'bg-violet-50',  border: 'border-violet-100',  icon: 'text-violet-500'  },
    };
    const c = colors[color] || colors.indigo;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 md:p-5 flex items-start gap-3 min-w-0">
            <div className={`p-2 md:p-3 rounded-xl border ${c.bg} ${c.border} shrink-0`}>
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${c.icon}`} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest truncate leading-tight">
                    {label}
                </p>
                <p className="text-lg md:text-2xl font-black text-slate-800 leading-tight mt-0.5 truncate">
                    {value}
                </p>
                {sub && (
                    <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 truncate">{sub}</p>
                )}
            </div>
        </div>
    );
};

const KpiCards = ({ kpis }) => {
    if (!kpis) return null;
    const utilidadPositiva = kpis.utilidad_bruta >= 0;

    return (
        /* 2 columnas en móvil, 3 en md, 6 en xl */
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
            <KpiCard
                icon={BanknotesIcon}
                label="Total ventas"
                value={formatSol(kpis.total_ventas)}
                sub={`${formatNum(kpis.cantidad_ventas)} transacc.`}
                color="emerald"
            />
            <KpiCard
                icon={ReceiptPercentIcon}
                label="Ticket prom."
                value={formatSol(kpis.ticket_promedio)}
                sub="Por venta"
                color="indigo"
            />
            <KpiCard
                icon={ShoppingCartIcon}
                label="Compras"
                value={formatSol(kpis.total_compras)}
                sub="Período actual"
                color="amber"
            />
            <KpiCard
                icon={ArrowTrendingUpIcon}
                label="Utilidad bruta"
                value={formatSol(kpis.utilidad_bruta)}
                sub={utilidadPositiva ? 'Ventas − Compras' : '⚠ Compras > Ventas'}
                color={utilidadPositiva ? 'emerald' : 'rose'}
            />
            <KpiCard
                icon={ClipboardDocumentListIcon}
                label="Órdenes act."
                value={formatNum(kpis.ordenes_activas)}
                sub="Ahora mismo"
                color="sky"
            />
            <KpiCard
                icon={CubeIcon}
                label="Salidas"
                value={formatNum(kpis.salidas_almacen)}
                sub="En el período"
                color="violet"
            />
        </div>
    );
};

export default KpiCards;