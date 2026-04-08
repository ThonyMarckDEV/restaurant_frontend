import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/ordenService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [alert, setAlert]     = useState(null);
    const [cart, setCart]       = useState([]);
    
    // Estado para manejar el PDF generado
    const [pdfData, setPdfData] = useState({ isOpen: false, url: null });

    const [orderConfig, setOrderConfig] = useState({
        tipo_pedido:   2,
        cliente_id:    null,
        nombre_llevar: ''
    });

    const updateConfig = (key, value) =>
        setOrderConfig(prev => ({ ...prev, [key]: value }));

    // Conversor de Base64 a Blob para el Iframe
    const base64ToBlob = (base64, type) => {
        const bin = atob(base64);
        const len = bin.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        return new Blob([arr], { type });
    };

    const handleSubmit = async () => {
        if (cart.length === 0)
            return setAlert({ type: 'error', message: 'El carrito está vacío.' });
        
        setLoading(true);
        try {
            const payload = {
                tipo_pedido:   2,
                mesa_id:       null,
                cliente_id:    orderConfig.cliente_id || null,
                nombre_llevar: orderConfig.nombre_llevar,
                items: cart.map(c => ({
                    plato_id:        c.type === 'plato'     ? c.id : null,
                    menu_id:         c.type === 'menu'      ? c.id : null,
                    insumo_id:       c.type === 'insumo'    ? c.id : null,
                    adicional_id:    c.type === 'adicional' ? c.id : null,
                    almacen_id:      c.almacen_id || null,
                    cantidad:        c.cantidad,
                    precio_unitario: c.precio_unitario,
                    observaciones:   c.observaciones,
                    platos_menu:     c.platos_menu?.map(p => ({ plato_id: p.plato_id })) || []
                }))
            };
            const response = await store(payload);
            setAlert({ type: 'success', message: '¡Orden enviada! Generando comanda...' });
            
            const pdfString = response?.pdf || response?.data?.pdf || response?.data?.data?.pdf;

            if (pdfString) {
                const blob = base64ToBlob(pdfString, 'application/pdf');
                const url = URL.createObjectURL(blob);
                setPdfData({ isOpen: true, url });
            } else {
                // Solo si el backend falló en generar el PDF, redirige a cobrar
                setTimeout(() => navigate('/venta/crear'), 1000); 
            }
        } catch (err) {
            setAlert(handleApiError(err, 'Error al enviar orden'));
        } finally { setLoading(false); }
    };

    // Función que se ejecuta al cerrar el modal del PDF
    const handleClosePdf = () => {
        setPdfData({ isOpen: false, url: null });
        navigate('/venta/crear'); // RECIÉN AQUÍ REDIRIGE A COBRAR
    };

    return { 
        cart, setCart, loading, alert, setAlert, 
        handleSubmit, orderConfig, updateConfig, 
        pdfData, handleClosePdf 
    };
};