import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/ordenService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading]     = useState(true);
    const [alert, setAlert]         = useState(null);
    const [cart, setCart]           = useState([]);
    const [ordenData, setOrdenData] = useState(null);
    const [isClosed, setIsClosed]   = useState(false);
    
    // Estado para el modal de PDF
    const [pdfData, setPdfData] = useState({ isOpen: false, url: null });

    const isDataLoaded      = useRef(false);
    const skipAutoSave      = useRef(false);

    const [orderConfig, setOrderConfig] = useState({
        tipo_pedido:             2,
        cliente_id:              null,
        nombre_llevar:           '',
        cliente_nombre_completo: ''
    });

    const configRef = useRef(orderConfig);

    const updateConfig = (key, value) => {
        setOrderConfig(prev => {
            const next = { ...prev, [key]: value };
            configRef.current = next;
            return next;
        });
    };

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
            platos_menu:     (d.platos_menu || []).map(pm => ({ 
                plato_id: pm.plato_id, 
                nombre: pm.plato?.nombre || pm.nombre 
            }))
        }));
    }, []);

    const fetchOrdenData = useCallback(async (isInitialLoad = false) => {
        if (isInitialLoad) setLoading(true);
        try {
            const response = await show(id);
            const data = response.data || response;

            // Si la orden ya fue pagada o anulada, bloqueamos y redirigimos
            if (data.estado === 2 || data.estado === 3) {
                setIsClosed(true);
                skipAutoSave.current  = true;
                setAlert({ type: 'info', message: 'Orden finalizada. Volviendo al historial...' });
                setTimeout(() => navigate('/orden/llevar', { replace: true }), 1500);
                return;
            }

            skipAutoSave.current = true;
            setOrdenData(data);

            const newConfig = {
                tipo_pedido:             2,
                cliente_id:              data.cliente_id  || null,
                nombre_llevar:           data.nombre_llevar           || '',
                cliente_nombre_completo: data.cliente_nombre_completo || ''
            };
            setOrderConfig(newConfig);
            configRef.current = newConfig;

            setCart(mapDetallesToCart(data.detalles));
            isDataLoaded.current = true;
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar pedido.'));
        } finally {
            if (isInitialLoad) setLoading(false);
        }
    }, [id, mapDetallesToCart, navigate]);

    // Carga inicial
    useEffect(() => { fetchOrdenData(true); }, [fetchOrdenData]);

    // Convertir Base64 a Blob
    const base64ToBlob = (base64, type) => {
        const bin = atob(base64);
        const len = bin.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        return new Blob([arr], { type });
    };

    // Auto-save lógico
    useEffect(() => {
        if (isClosed || !isDataLoaded.current) return;
        if (skipAutoSave.current) { skipAutoSave.current = false; return; }

        const timer = setTimeout(async () => {
            try {
                const payload = {
                    tipo_pedido:   2,
                    mesa_id:       null,
                    cliente_id:    configRef.current.cliente_id,
                    nombre_llevar: configRef.current.nombre_llevar,
                    items: cart.map(c => ({
                        id:              c.id_detalle || null,
                        plato_id:        c.type === 'plato'     ? c.id : null,
                        menu_id:         c.type === 'menu'      ? c.id : null,
                        insumo_id:       c.type === 'insumo'    ? c.id : null,
                        adicional_id:    c.type === 'adicional' ? c.id : null,
                        almacen_id:      c.almacen_id || null,
                        cantidad:        c.cantidad,
                        precio_unitario: c.precio_unitario,
                        observaciones:   c.observaciones,
                        estado:          c.estado,
                        platos_menu:     c.platos_menu?.map(p => ({ plato_id: p.plato_id })) || []
                    }))
                };
                const response = await update(id, payload);
                
                // Si el backend manda PDF actualizado, actualizamos el modal
                if (response.pdf) {
                    const blob = base64ToBlob(response.pdf, 'application/pdf');
                    const url = URL.createObjectURL(blob);
                    setPdfData({ isOpen: true, url });
                }

                setAlert({ type: 'success', message: 'Pedido sincronizado' });
                setTimeout(() => setAlert(null), 1500);
            } catch (err) {
                setAlert(handleApiError(err, 'Error al guardar cambios'));
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [cart, orderConfig, id, isClosed]);

    return { 
        cart, setCart, ordenData, loading, alert, setAlert, 
        isClosed, orderConfig, updateConfig, pdfData, setPdfData 
    };
};