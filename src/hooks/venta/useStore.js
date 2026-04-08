import { useState } from 'react';
import { store } from 'services/ventaService';
import { show as showOrden } from 'services/ordenService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const [loading, setLoading] = useState(false);
    const [loadingOrden, setLoadingOrden] = useState(false);
    const [alert, setAlert] = useState(null);
    const [ordenDetalle, setOrdenDetalle] = useState(null);
    const [pdfData, setPdfData] = useState({ isOpen: false, url: null });
    const [resetTrigger, setResetTrigger] = useState(false); // 🔥 Para limpiar el combo

    const initialForm = {
        orden_id: '', cliente_id: '', total: 0, metodo_pago: 1, pago_con: '', vuelto: 0, nro_operacion: ''
    };

    const [formData, setFormData] = useState(initialForm);

    const handleChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            if (field === 'pago_con') {
                const p = parseFloat(value) || 0;
                const t = parseFloat(prev.total) || 0;
                newData.vuelto = p > t ? (p - t).toFixed(2) : 0;
            }
            return newData;
        });
    };

    const handleOrdenReset = () => {
        setOrdenDetalle(null);
        setFormData(initialForm);
        setResetTrigger(true); // Dispara la limpieza del input
        setTimeout(() => setResetTrigger(false), 100);
    };

    const handleOrdenSelect = async (orden) => {
        if (!orden?.id) return handleOrdenReset();
        setLoadingOrden(true);
        try {
            const res = await showOrden(orden.id);
            const dataOrden = res.data || res;
            const total = dataOrden.detalles?.reduce((acc, c) => acc + Number(c.subtotal), 0) || 0;
            setOrdenDetalle(dataOrden);
            setFormData(prev => ({ ...prev, orden_id: dataOrden.id, total, cliente_id: dataOrden.cliente_id || '' }));
            setAlert(null);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar orden.'));
        } finally { setLoadingOrden(false); }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await store({ ...formData });
            const resData = response.data || response;

            if (resData.pdf) {
                const bin = atob(resData.pdf);
                const arr = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
                const url = URL.createObjectURL(new Blob([arr], { type: 'application/pdf' }));
                setPdfData({ isOpen: true, url });
            }

            setAlert({ type: 'success', message: 'Venta realizada.' });
            handleOrdenReset();
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    };

    return { 
        formData, loading, loadingOrden, alert, setAlert, ordenDetalle,
        handleChange, handleOrdenSelect, handleOrdenReset, handleSubmit,
        pdfData, handleClosePdf: () => setPdfData({ isOpen: false, url: null }),
        resetTrigger
    };
};