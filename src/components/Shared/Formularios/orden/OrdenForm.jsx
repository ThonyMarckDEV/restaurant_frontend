import React from 'react';
import { ShoppingCartIcon, UserIcon, MapPinIcon } from '@heroicons/react/24/outline';
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
        <div className="flex flex-col lg:flex-row gap-3
            /* Aumentamos la altura total en móvil de 130px a 70px de margen */
            h-[calc(100dvh-70px)] min-h-[550px]
            lg:h-[calc(100vh-240px)] lg:min-h-[450px]">

            {/* ── Toggle catálogo / comanda ── */}
            <div className="lg:hidden shrink-0 flex rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 p-1 gap-1">
                <button
                    type="button"
                    onClick={() => setShowCart(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${!showCart ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                >
                    Catálogo
                </button>
                <button
                    type="button"
                    onClick={() => setShowCart(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all relative ${showCart ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400'}`}
                >
                    Comanda
                    {activeCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-black rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 border-2 border-white">
                            {activeCount}
                        </span>
                    )}
                </button>
            </div>

            {/* ── Panel Catálogo ── */}
            <div className={`
                flex-1 min-w-0 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden
                ${showCart ? 'hidden lg:flex' : 'flex'}
            `}>
                <div className="shrink-0 flex border-b border-gray-100 bg-gray-50">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setActiveTab(t.id)}
                            className={`flex-1 py-4 text-[11px] font-bold uppercase tracking-wide transition-colors ${activeTab === t.id ? 'bg-white text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto p-3 min-h-0">
                    <Tab onAdd={addFns[activeTab]} />
                </div>
            </div>

            {/* ── Panel Comanda (Grande en Móvil) ── */}
            <div className={`
                w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden
                /* flex-1 en móvil para que crezca todo lo posible */
                ${showCart ? 'flex flex-1' : 'hidden lg:flex'}
            `}>
                {/* Header Comanda */}
                <div className="shrink-0 flex items-center justify-center px-4 py-4 bg-gray-900 relative">
                    <div className="flex items-center gap-2">
                        <ShoppingCartIcon className="w-5 h-5 text-white opacity-70" />
                        <span className="text-base font-black text-white">Tu Comanda</span>
                    </div>
                    {/* Botón de volver eliminado de aquí por pedido */}
                </div>

               {/* Info pedido */}
                <div className="shrink-0 p-4 border-b border-gray-100 bg-gray-50 space-y-3">
                    {tipoPedido === 1 ? (
                        <div className="flex items-center justify-start gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2 border-r border-gray-100 pr-3">
                                <MapPinIcon className="w-5 h-5 text-blue-700" />
                                <span className="text-xs font-black text-gray-500 uppercase tracking-tight">Mesa</span>
                            </div>
                            <span className="text-lg font-black text-blue-700">
                                {mesaNumero}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                                <UserIcon className="w-5 h-5 text-amber-500" />
                                <span className="text-xs font-black text-amber-700 uppercase tracking-wide">Pedido para Llevar</span>
                            </div>
                            
                            <input
                                type="text"
                                placeholder="Nombre para llevar"
                                value={nombreLlevar || ''}
                                onChange={(e) => updateConfig('nombre_llevar', e.target.value)}
                                disabled={!!clienteId}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gray-900 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                            />
                        </div>
                    )}

                    <ClienteSearchSelect
                        onSelect={c => updateConfig('cliente_id', c.id)}
                        placeholder="Buscar cliente registrado..."
                        initialName={clienteNombreCompleto}
                        disabled={!!nombreLlevar || isEditingOrder}
                    />
                </div>

                {/* Items con scroll flexible */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-gray-50/50 space-y-3">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
                            <ShoppingCartIcon className="w-16 h-16 opacity-20" />
                            <p className="text-sm font-black uppercase tracking-widest text-center">Vacía</p>
                        </div>
                    ) : (
                        sorted.map(({ item, idx }) => (
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
                        ))
                    )}
                </div>

                {/* Footer Fijo */}
                <div className="shrink-0 px-4 py-5 border-t border-gray-200 bg-white space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total a pagar</span>
                        <span className="text-3xl font-black text-gray-900 tabular-nums">S/ {total.toFixed(2)}</span>
                    </div>
                    {onSave && (
                        <button
                            type="button"
                            onClick={handleGuardar}
                            disabled={cart.length === 0}
                            className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-black uppercase tracking-widest text-base py-5 rounded-2xl shadow-xl transition-all active:scale-[0.96]"
                        >
                            {isEditingOrder ? 'Actualizar Pedido' : 'Enviar a Cocina'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdenForm;