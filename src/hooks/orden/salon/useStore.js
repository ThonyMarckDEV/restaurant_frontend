import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { store } from 'services/ordenService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const { mesa_id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [cart, setCart] = useState([]);

    const [orderConfig, setOrderConfig] = useState({
        tipo_pedido: 1,
        mesa_id: mesa_id || null,
        mesa_numero: location.state?.mesa_numero || null,
        cliente_id: null
    });

    useEffect(() => {
        if (mesa_id) {
            setOrderConfig(prev => ({
                ...prev,
                mesa_id: mesa_id,
                mesa_numero: location.state?.mesa_numero || mesa_id
            }));
        }
    }, [mesa_id, location.state]);

    const updateConfig = (key, value) => setOrderConfig(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async () => {
        if (cart.length === 0) return setAlert({ type: 'error', message: 'La comanda está vacía.' });

        setLoading(true);
        try {
            const payload = {
                tipo_pedido: 1,
                mesa_id: orderConfig.mesa_id,
                cliente_id: orderConfig.cliente_id || null,
                items: cart.map(c => ({
                    plato_id: c.type === 'plato' ? c.id : null,
                    menu_id: c.type === 'menu' ? c.id : null,
                    insumo_id: c.type === 'insumo' ? c.id : null,
                    adicional_id: c.type === 'adicional' ? c.id : null,
                    almacen_id: c.almacen_id || null,
                    cantidad: c.cantidad,
                    precio_unitario: c.precio_unitario,
                    observaciones: c.observaciones,
                    platos_menu: c.platos_menu?.map(p => ({ plato_id: p.plato_id })) || []
                }))
            };

            const response = await store(payload);
            
            // Extraemos la orden y el PDF de la respuesta (ajustado a tu estructura JSON)
            const newOrden = response?.data?.orden || response?.orden;
            const pdfString = response?.data?.pdf || response?.pdf;

            if (!newOrden?.id) throw new Error("No se recibió el ID de la orden.");

            // Redirigimos a la pantalla de edición pasando el PDF en el "state"
            navigate(`/orden/salon/${newOrden.id}`, {
                state: { autoShowPdf: pdfString },
                replace: true
            });

        } catch (err) {
            setAlert(handleApiError(err, 'Error al enviar la comanda'));
            setLoading(false);
        }
    };

    return { 
        cart, 
        setCart, 
        loading, 
        alert, 
        setAlert, 
        handleSubmit, 
        orderConfig, 
        updateConfig 
    };
};