import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { show, update } from 'services/ordenService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const location = useLocation();

    const [loading, setLoading]     = useState(true);
    const [alert, setAlert]         = useState(null);
    const [cart, setCart]           = useState([]);
    const [ordenData, setOrdenData] = useState(null);
    const [isClosed, setIsClosed]   = useState(false);
    const [pdfData, setPdfData]     = useState({ isOpen: false, url: null });

    const [orderConfig, setOrderConfig] = useState({
        tipo_pedido: 1, mesa_id: null, mesa_numero: null, cliente_id: null, nombre_llevar: ''
    });

    const configRef = useRef(orderConfig);

    const updateConfig = (key, value) => {
        setOrderConfig(prev => {
            const next = { ...prev, [key]: value };
            configRef.current = next;
            return next;
        });
    };

    const openPdf = useCallback((pdfString) => {
        if (!pdfString) return;
        try {
            const bin = atob(pdfString);
            const arr = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
            const url = URL.createObjectURL(new Blob([arr], { type: 'application/pdf' }));
            setPdfData({ isOpen: true, url });
        } catch (e) { console.error('Error PDF:', e); }
    }, []);

    const mapDetallesToCart = useCallback((detalles) => {
        if (!Array.isArray(detalles)) return [];
        return detalles.map(d => ({
            id_detalle:      d.id,
            id:              d.plato_id || d.insumo_id || d.menu_id || d.adicional_id,
            type:            d.plato_id ? 'plato' : d.insumo_id ? 'insumo' : d.menu_id ? 'menu' : 'adicional',
            nombre:          d.plato?.nombre || d.insumo?.nombre || d.menu?.nombre || d.adicional?.nombre,
            precio_unitario: parseFloat(d.precio_unitario),
            cantidad:        parseFloat(d.cantidad),
            almacen_id:      d.almacen_id || null,
            observaciones:   d.observaciones || '',
            estado:          Number(d.estado),
            stock_actual:    d.insumo?.stock_actual || 999,
            platos_menu:     (d.platos_menu || []).map(pm => ({ plato_id: pm.plato_id, nombre: pm.plato?.nombre || pm.nombre }))
        }));
    }, []);

    const fetchOrdenData = useCallback(async (isInitialLoad = false) => {
        if (isInitialLoad) setLoading(true);
        try {
            const response = await show(id);
            const data = response.data || response;
            if (data.estado === 2 || data.estado === 3) { setIsClosed(true); return; }
            setOrdenData(data);
            const newConfig = {
                tipo_pedido: data.tipo_pedido, mesa_id: data.mesa_id, mesa_numero: data.mesa?.numero || 'S/N',
                cliente_id: data.cliente_id || null, nombre_llevar: data.nombre_llevar || ''
            };
            setOrderConfig(newConfig);
            configRef.current = newConfig;
            setCart(mapDetallesToCart(data.detalles));
        } catch (err) { setAlert(handleApiError(err, 'Error al cargar comanda.')); }
        finally { if (isInitialLoad) setLoading(false); }
    }, [id, mapDetallesToCart]);

    useEffect(() => {
        fetchOrdenData(true).then(() => {
            if (location.state?.autoShowPdf) {
                openPdf(location.state.autoShowPdf);
                window.history.replaceState({}, document.title);
            }
        });
    }, [id, fetchOrdenData, location.state, openPdf]);

    const buildPayload = (config, currentCart) => ({
        tipo_pedido: config.tipo_pedido,
        mesa_id: config.mesa_id,
        cliente_id: config.cliente_id,
        nombre_llevar: config.nombre_llevar,
        items: currentCart.map(c => ({
            id: c.id_detalle || null,
            plato_id: c.type === 'plato' ? c.id : null,
            menu_id: c.type === 'menu' ? c.id : null,
            insumo_id: c.type === 'insumo' ? c.id : null,
            adicional_id: c.type === 'adicional' ? c.id : null,
            almacen_id: c.almacen_id || null,
            cantidad: c.cantidad,
            precio_unitario: c.precio_unitario,
            estado: c.estado,
            observaciones: c.observaciones,
            platos_menu: c.platos_menu?.map(p => ({ plato_id: p.plato_id })) || []
        }))
    });

    const handleSubmit = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const response = await update(id, buildPayload(configRef.current, cart));
            const resData = response?.data || response;
            if (resData.pdf) openPdf(resData.pdf);
            setAlert({ type: 'success', message: '¡Comanda actualizada!' });
            await fetchOrdenData(false);
        } catch (err) { setAlert(handleApiError(err, 'Error al actualizar.')); }
        finally { setLoading(false); }
    };

    const handleUpdateItemStatus = async (idx, nuevoEstado) => {
        const item = cart[idx];
        const newCart = cart.map((it, i) => i === idx ? { ...it, estado: nuevoEstado } : it);
        setCart(newCart);
        try {
            const response = await update(id, buildPayload(configRef.current, newCart));
            const resData = response?.data || response;
            if (resData.pdf) openPdf(resData.pdf);
            if (nuevoEstado === 2) {
                setAlert({ type: 'success', message: `¡${item.nombre} entregado!` });
                setTimeout(() => setAlert(null), 2000);
            }
        } catch (err) { fetchOrdenData(false); setAlert({ type: 'error', message: 'Error al actualizar estado.' }); }
    };

    const handleClosePdf = () => {
        if (pdfData.url) URL.revokeObjectURL(pdfData.url);
        setPdfData({ isOpen: false, url: null });
    };

    return { 
        cart, setCart, ordenData, loading, alert, setAlert, isClosed, 
        orderConfig, updateConfig, handleSubmit, pdfData, handleClosePdf, handleUpdateItemStatus 
    };
};