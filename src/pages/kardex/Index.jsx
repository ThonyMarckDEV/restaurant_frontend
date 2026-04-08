import React, { useMemo } from 'react';
import { useIndex } from 'hooks/kardex/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InsumoSearchSelect from 'components/Shared/Comboboxes/InsumoSearchSelect';
import AlmacenSearchSelect from 'components/Shared/Comboboxes/AlmacenSearchSelect';
import { 
    BookOpenIcon, 
    ArrowDownRightIcon, 
    ArrowUpRightIcon, 
    HomeModernIcon
} from '@heroicons/react/24/outline';

// Diccionario para traducir los números de la BD a texto legible
const TIPOS_MOVIMIENTO = {
    1: 'Compra',
    2: 'Traspaso',
    3: 'Consumo Cocina',
    4: 'Venta',
    5: 'Merma',
    6: 'Ajuste Inventario'
};

const Index = () => {
    const {
        loading, movimientos, paginationInfo, filters, setFilters, alert, setAlert,
        fetchMovimientos, handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        {
            name: 'insumo_id',
            type: 'custom',
            colSpan: 'col-span-12 md:col-span-3',
            render: () => (
                <div className="flex flex-col">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ítem / Insumo</label>
                    <div className="relative w-full">
                        <InsumoSearchSelect 
                            form={filters}
                            setForm={setFilters}
                            isFilter={true}
                        />
                    </div>
                </div>
            )
        },
        {
            name: 'almacen_id',
            type: 'custom',
            colSpan: 'col-span-12 md:col-span-3',
            render: () => (
                <div className="flex flex-col">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Almacén</label>
                    <AlmacenSearchSelect 
                        form={filters} 
                        setForm={setFilters} 
                        isFilter={true}
                    />
                </div>
            )
        },
        { 
            name: 'tipo_movimiento', 
            type: 'select', 
            label: 'Movimiento', 
            options: [
                { value: '', label: 'Todos' },
                { value: '1', label: 'Compra' },
                { value: '2', label: 'Traspaso' },
                { value: '3', label: 'Consumo Cocina' },
                { value: '4', label: 'Venta' },
                { value: '5', label: 'Merma' },
                { value: '6', label: 'Ajuste Inv.' },
            ],
            colSpan: 'col-span-12 md:col-span-2' 
        },
        { name: 'fecha_inicio', type: 'date', label: 'Desde', colSpan: 'col-span-12 md:col-span-2' },
        { name: 'fecha_fin', type: 'date', label: 'Hasta', colSpan: 'col-span-12 md:col-span-2' }
    ], [filters, setFilters]); // <--- handleFilterChange eliminado de aquí

    const columns = useMemo(() => [
        { 
            header: 'Fecha / Hora', 
            render: (row) => (
                <div className="flex flex-col min-w-[85px]">
                    <span className="font-bold text-slate-700 text-xs">
                        {new Date(row.created_at).toLocaleDateString('es-PE')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">
                        {new Date(row.created_at).toLocaleTimeString('es-PE')}
                    </span>
                </div>
            )
        },
        { 
            header: 'Ítem / Almacén', 
            render: (row) => (
                <div className="flex flex-col min-w-[150px]">
                    <span className="font-black text-slate-800 text-[11px] uppercase leading-tight">
                        {row.insumo?.nombre || 'Ítem Desconocido'}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                        <HomeModernIcon className="w-3 h-3 text-slate-400" />
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">
                            {row.almacen?.nombre || 'Desconocido'}
                        </span>
                    </div>
                </div>
            )
        },
        { 
            header: 'Saldo Anterior', 
            render: (row) => {
                const cantidad = Number(row.cantidad);
                const saldoDespues = Number(row.saldo_despues);
                const saldoAnterior = parseInt(row.tipo_operacion) === 1 
                    ? saldoDespues - cantidad 
                    : saldoDespues + cantidad;

                return (
                    <div className="text-slate-600 font-mono text-xm font-bold text-center">
                        {saldoAnterior.toFixed(2)}
                    </div>
                );
            }
        },
        { 
            header: 'Movimiento', 
            render: (row) => {
                const esIngreso = parseInt(row.tipo_operacion) === 1;
                return (
                    <div className={`flex items-center justify-center gap-1 font-mono font-black ${esIngreso ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full border ${esIngreso ? 'border-emerald-100' : 'border-red-100'}`}>
                        {esIngreso ? <ArrowDownRightIcon className="w-3 h-3 stroke-2" /> : <ArrowUpRightIcon className="w-3 h-3 stroke-2" />}
                        <span className="text-xs">
                            {esIngreso ? '+' : '-'}{Number(row.cantidad)}
                        </span>
                    </div>
                );
            }
        },
        { 
            header: 'Saldo Final', 
            render: (row) => (
                <div className="flex items-center justify-center gap-1.5 bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200 shadow-sm">
                    <span className="text-sm font-black font-mono">
                        {Number(row.saldo_despues).toFixed(2)}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-slate-500">
                        {row.insumo?.unidad_medida?.abreviatura || 'und'}
                    </span>
                </div>
            )
        },
        { 
            header: 'Operación / Responsable', 
            render: (row) => {
                const nombre = row.usuario?.datos_empleado?.nombre || '';
                const apP = row.usuario?.datos_empleado?.apellidoPaterno || '';
                const apM = row.usuario?.datos_empleado?.apellidoMaterno || '';
                const full = nombre ? `${nombre} ${apP} ${apM}`.trim() : 'SISTEMA';

                return (
                    <div className="flex flex-col min-w-[120px]">
                        <span className="font-bold text-slate-800 text-[10px] uppercase">
                            {TIPOS_MOVIMIENTO[row.tipo_movimiento] || 'Otro'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                            Por: {full}
                        </span>
                    </div>
                )
            }
        }
    ], []);

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Kardex de Insumos" 
                subtitle="Registro histórico de entradas y salidas de almacén"
                icon={BookOpenIcon} 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table 
                columns={columns} 
                data={movimientos} 
                loading={loading} 
                filterConfig={filterConfig}
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onFilterSubmit={handleFilterSubmit} 
                onFilterClear={handleFilterClear} 
                pagination={{...paginationInfo, onPageChange: fetchMovimientos}} 
            />
        </div>
    );
};

export default Index;