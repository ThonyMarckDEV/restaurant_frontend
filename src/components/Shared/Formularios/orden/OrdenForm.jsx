import React from 'react';
import { ShoppingCartIcon, ChevronLeftIcon, UserIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { CartaTab, InsumosTab, AdicionalesTab, MenuTab } from './CatalogoTabs';
import CartItem from './Cartitem';
import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import { useOrdenForm } from 'hooks/orden/useOrdenForm';

const TABS = [
    { id: 'carta',   label: 'Carta',   Tab: CartaTab      },
    { id: 'menu',    label: 'Menú',    Tab: MenuTab       },
    { id: 'insumos', label: 'Insumos', Tab: InsumosTab    },
    { id: 'extras',  label: 'Extras',  Tab: AdicionalesTab },
];

const OrdenForm = ({ cart, setCart, orderConfig = null, updateConfig, onSave, setAlert, onUpdateStatus }) => {
    const {
        activeTab, setActiveTab, showCart, setShowCart,
        tipoPedido, mesaNumero, clienteId, nombreLlevar, clienteNombreCompleto,
        addPlato, addInsumo, addAdicional, addMenu,
        onEstado, onCantidad, onObs,
        total, activeCount, handleGuardar,
    } = useOrdenForm({ cart, setCart, orderConfig, onSave, setAlert });

    const isEditingOrder = cart.some(item => item.id_detalle);

    const addFns  = { carta: addPlato, menu: addMenu, insumos: addInsumo, extras: addAdicional };
    const { Tab } = TABS.find(t => t.id === activeTab);
    const sorted  = [...cart].map((item, idx) => ({ item, idx })).sort((a, b) => a.item.estado - b.item.estado);

    return (
        <div className="flex flex-col lg:flex-row gap-3 h-[calc(100vh-240px)] min-h-[450px]">

            <button type="button" onClick={() => setShowCart(p => !p)}
                className="lg:hidden w-full flex items-center justify-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-sm font-black text-sm active:scale-95 transition-all shrink-0">
                <ShoppingCartIcon className="w-5 h-5" />
                {showCart ? 'Ver catálogo' : `Ver Comanda${activeCount > 0 ? ` (${activeCount})` : ''}`}
            </button>

            {/* Catálogo */}
            <div className={`w-full lg:w-3/5 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${showCart ? 'hidden lg:flex' : 'flex'}`}>
                <div className="flex border-b border-gray-100 bg-gray-50 shrink-0">
                    {TABS.map(t => (
                        <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
                            className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors ${activeTab === t.id ? 'bg-white text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto p-3 min-h-0">
                    <Tab onAdd={addFns[activeTab]} />
                </div>
            </div>

            {/* Comanda */}
            <div className={`w-full lg:w-2/5 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${showCart ? 'flex' : 'hidden lg:flex'}`}>
                <div className="flex items-center justify-between px-3 py-2.5 bg-gray-900 text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <ShoppingCartIcon className="w-4 h-4 opacity-70" />
                        <span className="text-sm font-black">Comanda</span>
                        {activeCount > 0 && (
                            <span className="bg-green-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                                {activeCount}
                            </span>
                        )}
                    </div>
                    <button type="button" onClick={() => setShowCart(false)}
                        className="lg:hidden flex items-center gap-1 text-[11px] font-bold text-white/60 hover:text-white">
                        <ChevronLeftIcon className="w-3.5 h-3.5" /> Volver
                    </button>
                </div>

                <div className="p-3 border-b border-gray-200 bg-slate-50 shrink-0 space-y-3">
                    {tipoPedido === 1 ? (
                        <div className="text-xs font-bold text-indigo-700 flex items-center justify-between gap-2 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-indigo-500" />
                                <span className="uppercase tracking-wide">Consumo en Salón</span>
                            </div>
                            <span className="font-black text-sm bg-white px-2 py-0.5 rounded shadow-sm">
                                MESA {mesaNumero ?? '—'}
                            </span>
                        </div>
                    ) : (
                        <div className="text-xs font-bold text-amber-700 flex items-center gap-2 bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                            <UserIcon className="w-5 h-5 text-amber-500" />
                            <span className="uppercase tracking-wide">Pedido Para Llevar</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <ClienteSearchSelect
                            onSelect={c => updateConfig('cliente_id', c.id)}
                            placeholder="Buscar cliente frecuente (opcional)..."
                            initialName={clienteNombreCompleto}
                            disabled={!!nombreLlevar || (!onSave && !!clienteId)}
                        />
                        {tipoPedido !== 1 && (
                            <input
                                type="text"
                                placeholder="O ingrese nombre para llamar al cliente..."
                                value={nombreLlevar}
                                onChange={e => updateConfig('nombre_llevar', e.target.value)}
                                disabled={!!clienteId || (!onSave && !!nombreLlevar)}
                                className="w-full text-xs py-2 px-3 border border-gray-300 rounded-lg outline-none focus:border-amber-500 transition-colors shadow-sm disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed font-medium"
                            />
                        )}
                    </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-2.5 bg-gray-50 max-h-[420px] lg:max-h-none">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[160px] text-gray-300">
                            <ShoppingCartIcon className="w-8 h-8 mb-2" />
                            <p className="text-xs font-bold">La comanda está vacía</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {sorted.map(({ item, idx }) => (
                                <CartItem
                                    key={idx}
                                    item={item}
                                    idx={idx}
                                    onEstado={onEstado}
                                    onCantidad={onCantidad}
                                    onObs={onObs}
                                    isEditing={!!item.id_detalle}
                                    tipoPedido={tipoPedido}
                                    onUpdateStatus={onUpdateStatus}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-3 py-3 border-t border-gray-200 bg-white shrink-0 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total activo</span>
                        <span className="text-xl font-black text-green-600">S/ {total.toFixed(2)}</span>
                    </div>
                    {onSave && (
                        <button
                            type="button"
                            onClick={handleGuardar}
                            disabled={cart.length === 0}
                            className="w-full bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50">
                            {/* 🔥 TEXTO DINÁMICO */}
                            {isEditingOrder ? 'Actualizar Comanda' : 'Enviar a Cocina'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdenForm;