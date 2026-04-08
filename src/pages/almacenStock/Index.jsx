import React, { useMemo } from 'react';
import { useIndex } from 'hooks/almacenStock/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import AlmacenSearchSelect from 'components/Shared/Comboboxes/AlmacenSearchSelect';
import {
    ArchiveBoxIcon,
    BeakerIcon,
    CheckIcon,
    XMarkIcon,
    PencilSquareIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, stocks, paginationInfo, filters, setFilters, alert, setAlert,
        editingId, editingValue, setEditingValue, savingId,
        startEditing, cancelEditing, saveStockMinimo,
        fetchStocks, handleFilterChange, handleFilterSubmit, handleFilterClear,
    } = useIndex();

    const filterConfig = useMemo(() => [
        {
            name: 'search',
            type: 'text',
            label: 'Buscar Insumo',
            placeholder: 'Ej: Pepsi, Tomate...',
            colSpan: 'col-span-12 md:col-span-3',
        },
        {
            name: 'almacen_id',
            type: 'custom',
            label: 'Almacén',
            colSpan: 'col-span-12 md:col-span-3',
            render: () => (
                <AlmacenSearchSelect
                    isFilter={true}
                    form={filters}
                    setForm={setFilters}
                    fieldId="almacen_id"
                    fieldNombre="almacenNombre"
                />
            ),
        },
        {
            name: 'con_stock_bajo',
            type: 'select',
            label: 'Stock Bajo',
            colSpan: 'col-span-12 md:col-span-2',
            options: [
                { value: '',   label: 'Todos' },
                { value: '1',  label: 'Solo críticos' },
            ],
        },
    ], [filters, setFilters]);

    const columns = useMemo(() => [
        {
            header: 'Insumo',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                        <BeakerIcon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-sm uppercase">{row.insumo?.nombre}</p>
                        {row.insumo?.es_venta_directa && (
                            <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase font-bold border border-green-200">
                                POS
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: 'Almacén',
            render: (row) => (
                <span className="text-xs font-bold text-slate-600 uppercase bg-slate-100 px-2 py-1 rounded border border-slate-200">
                    {row.almacen?.nombre}
                </span>
            ),
        },
        {
            header: 'Stock Actual',
            render: (row) => {
                const bajo = parseFloat(row.cantidad) <= parseFloat(row.stock_minimo) && parseFloat(row.stock_minimo) > 0;
                return (
                    <div className="flex items-center gap-2">
                        {bajo && (
                            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 shrink-0" title="Stock bajo mínimo" />
                        )}
                        <span className={`text-sm font-black ${bajo ? 'text-red-600' : 'text-slate-800'}`}>
                            {Number(row.cantidad)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {row.insumo?.unidadMedida?.abreviatura}
                        </span>
                    </div>
                );
            },
        },
        {
            header: 'Stock Mínimo',
            render: (row) => {
                const isEditing = editingId === row.id;
                const isSaving  = savingId  === row.id;

                if (isEditing) {
                    return (
                        <div className="flex items-center gap-1.5">
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                autoFocus
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter')  saveStockMinimo(row.id);
                                    if (e.key === 'Escape') cancelEditing();
                                }}
                                className="w-20 p-1.5 text-center text-sm border border-amber-300 bg-amber-50 rounded-lg focus:ring-1 focus:ring-amber-400 outline-none font-black"
                            />
                            <button
                                onClick={() => saveStockMinimo(row.id)}
                                disabled={isSaving}
                                className="p-1.5 bg-black text-white rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-50"
                                title="Guardar"
                            >
                                <CheckIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={cancelEditing}
                                className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-all"
                                title="Cancelar"
                            >
                                <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    );
                }

                return (
                    <div className="flex items-center gap-2 group">
                        <span className="text-sm font-black text-amber-600">
                            {Number(row.stock_minimo)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {row.insumo?.unidadMedida?.abreviatura}
                        </span>
                        <button
                            onClick={() => startEditing(row)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-black hover:bg-slate-100 rounded transition-all"
                            title="Editar stock mínimo"
                        >
                            <PencilSquareIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                );
            },
        },
        {
            header: 'Estado',
            render: (row) => {
                const bajo = parseFloat(row.cantidad) <= parseFloat(row.stock_minimo) && parseFloat(row.stock_minimo) > 0;
                return (
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase border ${
                        bajo
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'bg-green-50 text-green-600 border-green-200'
                    }`}>
                        {bajo ? 'Stock Bajo' : 'Normal'}
                    </span>
                );
            },
        },
    ], [editingId, editingValue, savingId, startEditing, cancelEditing, saveStockMinimo, setEditingValue]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader
                title="Stock por Almacén"
                subtitle="Consulta y configura los mínimos de alerta por almacén"
                icon={ArchiveBoxIcon}
            />

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />

            <Table
                columns={columns}
                data={stocks}
                loading={loading}
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchStocks }}
                rowClassName={(row) => {
                    const bajo = parseFloat(row.cantidad) <= parseFloat(row.stock_minimo) && parseFloat(row.stock_minimo) > 0;
                    return bajo ? 'bg-red-50/40' : '';
                }}
            />
        </div>
    );
};

export default Index;