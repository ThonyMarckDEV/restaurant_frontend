import { useState, useRef, useCallback, useEffect } from 'react'; 

export const makeItem = (type, id, nombre, precio_unitario, extra = {}) => ({
    type, id, nombre, precio_unitario,
    cantidad: 1, observaciones: '', estado: 1, ...extra,
});

export const useCatalogo = (fetchFn, baseParams = {}) => {
    const [items, setItems]           = useState([]);
    const [loading, setLoading]       = useState(false);
    const [page, setPage]             = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch]         = useState('');
    const debounce  = useRef(null);
    
    const strParams = JSON.stringify(baseParams);

    const load = useCallback(async (p, s) => {
        const params = JSON.parse(strParams);
        
        if (params.isVentaMode && !params.almacen_id) { 
            setItems([]); 
            setTotalPages(1);
            return; 
        }

        setLoading(true);
        try {
            const res = await fetchFn(p, { ...params, ...(s ? { search: s } : {}) });
            setItems(res.data || []);
            setTotalPages(res.last_page || res.meta?.last_page || 1);
        } catch { 
            setItems([]); 
        } finally { 
            setLoading(false); 
        }
    }, [fetchFn, strParams]);

    // Escucha cambios en search o filtros para resetear a página 1
    useEffect(() => {
        clearTimeout(debounce.current);
        debounce.current = setTimeout(() => {
            setPage(1);
            load(1, search);
        }, 300);
        return () => clearTimeout(debounce.current);
    }, [search, strParams, load]); 

    // Carga cuando cambia la página (sin debounce)
    useEffect(() => {
        load(page, search);
    }, [page, load, search]);

    return { 
        items, 
        loading, 
        page, 
        setPage, // 🔥 Exportamos setPage directamente para que coincida con lo que pides
        totalPages, 
        search, 
        setSearch: (val) => setSearch(val) 
    };
};

export const useOrdenForm = ({ cart, setCart, orderConfig, onSave, setAlert }) => {
    const [activeTab, setActiveTab] = useState('carta');
    const [showCart,  setShowCart]  = useState(false);

    const tipoPedido            = orderConfig?.tipo_pedido             || 1;
    const mesaNumero            = orderConfig?.mesa_numero             || orderConfig?.mesa?.numero || null;
    const clienteId             = orderConfig?.cliente_id              || null;
    const nombreLlevar          = orderConfig?.nombre_llevar           || '';
    const clienteNombreCompleto = orderConfig?.cliente_nombre_completo || '';

    const notificar = (nombre) => {
        if (!setAlert) return;
        setAlert({ type: 'success', message: `¡Agregado: ${nombre}!` });
        setTimeout(() => setAlert(null), 1500);
    };

    const errorStock = (nombre) => {
        if (!setAlert) return;
        setAlert({ type: 'error', message: `¡Stock insuficiente para ${nombre}!` });
        setTimeout(() => setAlert(null), 2000);
    };

    const addPlato     = (p) => { setCart(c => [...c, makeItem('plato',     p.id, p.nombre, parseFloat(p.precio_carta))]); notificar(p.nombre); };
    const addAdicional = (a) => { setCart(c => [...c, makeItem('adicional', a.id, a.nombre, parseFloat(a.precio))]); notificar(a.nombre); };
    const addMenu      = (m) => { setCart(c => [...c, { ...m, cantidad: 1, observaciones: '', estado: 1 }]); notificar(m.nombre); };

    const addInsumo = (ins) => {
        const stockDisponible = parseFloat(ins.stock_actual || 0);
        if (stockDisponible <= 0) { errorStock(ins.nombre); return; }
        setCart(c => {
            const qtyEnCarrito = c
                .filter(x => x.type === 'insumo' && x.id === ins.id && x.estado !== 3)
                .reduce((suma, curr) => suma + curr.cantidad, 0);
            if (qtyEnCarrito >= stockDisponible) { errorStock(ins.nombre); return c; }
            setTimeout(() => notificar(ins.nombre), 0);
            return [...c, makeItem('insumo', ins.id, ins.nombre, parseFloat(ins.precio_venta), {
                stock_actual: stockDisponible,
                almacen_id:   ins.almacen_id
            })];
        });
    };

    const onEstado = (i, e) => setCart(c => {
        const item       = c[i];
        const nuevoEstado = Number(e);
        if (nuevoEstado === 3 && !item.id_detalle) return c.filter((_, idx) => idx !== i);
        return c.map((it, idx) => idx === i ? { ...it, estado: nuevoEstado } : it);
    });

    const onCantidad = (i, d) => setCart(c =>
        c.map((it, idx) => idx === i && it.estado === 1 ? { ...it, cantidad: Math.max(1, it.cantidad + d) } : it)
    );

    const onObs = (i, v) => setCart(c =>
        c.map((it, idx) => idx === i && it.estado === 1 ? { ...it, observaciones: v } : it)
    );

    const total       = cart.reduce((acc, it) => it.estado !== 3 ? acc + it.cantidad * it.precio_unitario : acc, 0);
    const activeCount = cart.filter(it => it.estado !== 3).length;

    return {
        activeTab, setActiveTab, showCart, setShowCart,
        tipoPedido, mesaNumero, clienteId, nombreLlevar, clienteNombreCompleto,
        addPlato, addInsumo, addAdicional, addMenu,
        onEstado, onCantidad, onObs,
        total, activeCount,
        handleGuardar: () => onSave?.(),
    };
};