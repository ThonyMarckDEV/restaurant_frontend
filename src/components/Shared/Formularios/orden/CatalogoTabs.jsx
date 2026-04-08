import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, XMarkIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import { index as getPlatos }       from 'services/platoService';
import { index as getInsumos }      from 'services/insumoService';
import { index as getAdicionales }  from 'services/adicionalService';
import { index as getMenus }        from 'services/menuService';
import { index as getMenuOpciones } from 'services/menuOpcionService';
import Pagination                   from 'components/Shared/Pagination';
import CategoriaPlatoSearchSelect   from 'components/Shared/Comboboxes/CategoriaPlatoSearchSelect';
import AlmacenSearchSelect          from 'components/Shared/Comboboxes/AlmacenSearchSelect';
import { useCatalogo }              from 'hooks/orden/useOrdenForm';
import ItemGrid                     from './Itemgrid';

const SearchBar = ({ value, onChange, placeholder }) => (
    <div className="flex items-center border border-gray-200 rounded-xl bg-white px-2.5 gap-2 focus-within:border-gray-400 transition-colors shadow-sm">
        <MagnifyingGlassIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="flex-1 py-2 text-xs text-gray-700 bg-transparent outline-none placeholder:text-gray-300" />
        {value && <button type="button" onClick={() => onChange('')} className="text-gray-300 hover:text-gray-500"><XMarkIcon className="w-3.5 h-3.5" /></button>}
    </div>
);

const TabLayout = ({ search, setSearch, placeholder, children, page, totalPages, setPage }) => (
    <div className="flex flex-col h-full gap-2">
        <div className="shrink-0"><SearchBar value={search} onChange={setSearch} placeholder={placeholder} /></div>
        <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0">{children}</div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
);

// ── Tabs ───────────────────────────────────────────────────────────

export const CartaTab = ({ onAdd }) => {
    const [cat, setCat] = useState({ categoria_id: '', categoria_nombre: '' });
    const l = useCatalogo(getPlatos, { estado: '1', isPos: 'true', categoria_id: cat.categoria_id });
    return (
        <div className="flex flex-col h-full gap-2">
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <div className="flex-1"><SearchBar value={l.search} onChange={l.setSearch} placeholder="Nombre del plato..." /></div>
                <div className="w-full sm:w-48 shrink-0"><CategoriaPlatoSearchSelect form={cat} setForm={setCat} isFilter /></div>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0">
                <ItemGrid items={l.items} loading={l.loading} onAdd={onAdd} getPrecio={p => p.precio_carta} />
            </div>
            <Pagination currentPage={l.page} totalPages={l.totalPages} onPageChange={l.setPage} />
        </div>
    );
};

export const InsumosTab = ({ onAdd }) => {
    const [almacen, setAlmacen] = useState({ id: '', nombre: '' });
    const l = useCatalogo(getInsumos, { estado: '1', isPos: 'true', es_venta_directa: 'true', almacen_id: almacen.id, isVentaMode: true });
    return (
        <div className="flex flex-col h-full gap-2">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
                <label className="text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-1 ml-1"><HomeModernIcon className="w-3 h-3" /> Punto de Despacho</label>
                <AlmacenSearchSelect isVenta form={almacen} setForm={setAlmacen} fieldId="id" fieldNombre="nombre" />
            </div>
            <div className={`shrink-0 transition-opacity ${!almacen.id ? 'opacity-40' : ''}`}>
                <SearchBar value={l.search} onChange={l.setSearch} placeholder="Buscar gaseosa, cerveza..." />
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0">
                {!almacen.id
                    ? <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60"><HomeModernIcon className="w-10 h-10 mb-2" /><p className="text-[10px] font-black uppercase">Selecciona un almacén</p></div>
                    : <ItemGrid items={l.items} loading={l.loading} onAdd={item => onAdd({ ...item, almacen_id: almacen.id })} getPrecio={i => i.precio_venta} />
                }
            </div>
            <Pagination currentPage={l.page} totalPages={l.totalPages} onPageChange={l.setPage} />
        </div>
    );
};

export const AdicionalesTab = ({ onAdd }) => {
    const l = useCatalogo(getAdicionales, { estado: '1', isPos: 'true' });
    return (
        <TabLayout search={l.search} setSearch={l.setSearch} placeholder="Buscar adicional..." page={l.page} totalPages={l.totalPages} setPage={l.setPage}>
            <ItemGrid items={l.items} loading={l.loading} onAdd={onAdd} getPrecio={a => a.precio} />
        </TabLayout>
    );
};

export const MenuTab = ({ onAdd }) => {
    const l = useCatalogo(getMenus, { estado: '1', isPos: 'true' });
    const [building,   setBuilding]   = useState(null);
    const [elegidos,   setElegidos]   = useState([]);
    const [loadingOps, setLoadingOps] = useState(false);

    const seleccionar = async (menu) => {
        setLoadingOps(true); setElegidos([]);
        try {
            const res = await getMenuOpciones(1, { menu_id: menu.id, disponible: 'true' });
            setBuilding({ menu, opciones: res.data || [] });
        } catch { setBuilding({ menu, opciones: [] }); }
        finally  { setLoadingOps(false); }
    };

    const toggle    = (op) => setElegidos(prev => prev.some(p => p.plato_id === op.plato_id) ? prev.filter(p => p.plato_id !== op.plato_id) : [...prev, { plato_id: op.plato_id, nombre: op.plato?.nombre }]);
    const confirmar = () => {
        if (!building || !elegidos.length) return;
        onAdd({ type: 'menu', id: building.menu.id, nombre: building.menu.nombre, precio_unitario: parseFloat(building.menu.precio || 0), platos_menu: elegidos });
        setBuilding(null); setElegidos([]);
    };

    if (loadingOps) return <p className="text-center text-xs text-gray-400 py-6">Cargando opciones...</p>;

    if (building) {
        const agrupadas = building.opciones.reduce((acc, op) => {
            const cat = op.plato?.categoria?.nombre || 'Otros';
            (acc[cat] = acc[cat] || []).push(op); return acc;
        }, {});
        return (
            <div className="flex flex-col h-full gap-2">
                <button type="button" onClick={() => setBuilding(null)} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-800 w-fit shrink-0">
                    <ChevronLeftIcon className="w-3.5 h-3.5" /> Volver
                </button>
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 shrink-0">
                    <p className="font-black text-sm text-gray-800">{building.menu.nombre}</p>
                    <p className="text-xs text-green-600 font-bold">S/ {parseFloat(building.menu.precio || 0).toFixed(2)}</p>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar min-h-0 flex flex-col gap-4">
                    {Object.entries(agrupadas).map(([cat, ops]) => (
                        <div key={cat}>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1 block mb-1.5">{cat}</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                {ops.map(op => {
                                    const sel = elegidos.some(p => p.plato_id === op.plato_id);
                                    return (
                                        <button key={op.plato_id} type="button" onClick={() => toggle(op)}
                                            className={`p-2 rounded-xl border text-xs font-bold text-left transition-all active:scale-95 ${sel ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}>
                                            {sel && '✓ '}{op.plato?.nombre}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={confirmar} disabled={!elegidos.length}
                    className="shrink-0 w-full bg-gray-900 text-white py-3 rounded-xl text-xs font-black disabled:opacity-40 active:scale-[0.98] transition-all">
                    Agregar ({elegidos.length} platos)
                </button>
            </div>
        );
    }

    return (
        <TabLayout search={l.search} setSearch={l.setSearch} placeholder="Buscar menú..." page={l.page} totalPages={l.totalPages} setPage={l.setPage}>
            {l.loading
                ? Array(3).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse mb-1.5" />)
                : l.items.map(m => (
                    <button key={m.id} type="button" onClick={() => seleccionar(m)}
                        className="flex items-center justify-between bg-white border border-gray-200 hover:border-gray-400 hover:shadow rounded-xl px-3 py-2.5 text-left transition-all group w-full mb-1.5">
                        <div>
                            <p className="text-xs font-bold text-gray-800">{m.nombre}</p>
                            {m.descripcion && <p className="text-[10px] text-gray-400 line-clamp-1">{m.descripcion}</p>}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs font-black text-green-600">S/ {parseFloat(m.precio || 0).toFixed(2)}</span>
                            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-600 transition-colors" />
                        </div>
                    </button>
                ))
            }
            {!l.loading && !l.items.length && <p className="text-center text-xs text-gray-400 py-6">Sin menús disponibles</p>}
        </TabLayout>
    );
};