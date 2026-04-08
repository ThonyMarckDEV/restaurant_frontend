import { useState, useEffect, useCallback } from 'react';
import { miSesionActiva, abrirTurno, cerrarTurno } from 'services/cajaSesionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useCajaSesion = () => {
    const [sesionActiva, setSesionActiva] = useState(null);
    const [loadingSesion, setLoadingSesion] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Formularios
    const [formAbrir, setFormAbrir] = useState({ caja_id: '', caja_nombre: '', monto_apertura: '', observaciones: '' });
    const [formCerrar, setFormCerrar] = useState({ monto_real: '', observaciones: '' });
    const [isCerrarModalOpen, setIsCerrarModalOpen] = useState(false);

    const checkSesion = useCallback(async () => {
        setLoadingSesion(true);
        try {
            const response = await miSesionActiva();
            
            let sessionReal = null;

            // 1. Si la respuesta trae "data" y dentro de "data" hay un "id"
            if (response?.data?.id) {
                sessionReal = response.data;
            } 
            // 2. Si la respuesta viene plana (handleResponse la extrajo directo) y tiene "id"
            else if (response?.id) {
                sessionReal = response;
            }

            // Si sessionReal sigue siendo null, bloqueará la pantalla correctamente.
            setSesionActiva(sessionReal);

        } catch (err) {
            console.error("Error al verificar sesión:", err);
            setSesionActiva(null);
        } finally {
            setLoadingSesion(false);
        }
    }, []);

    useEffect(() => { checkSesion(); }, [checkSesion]);

    const handleAbrir = async (e) => {
        e.preventDefault();
        setActionLoading(true); setAlert(null);
        try {
            await abrirTurno(formAbrir);
            setAlert({ type: 'success', message: '¡Turno abierto exitosamente! Ya puedes vender.' });
            await checkSesion(); // Recargamos para quitar el bloqueo
        } catch (err) {
            setAlert(handleApiError(err, 'Error al abrir el turno.'));
        } finally { setActionLoading(false); }
    };

    const handleCerrar = async (e) => {
        e.preventDefault();
        if (!sesionActiva) return;
        setActionLoading(true); setAlert(null);
        try {
            await cerrarTurno(sesionActiva.id, formCerrar);
            setAlert({ type: 'success', message: 'Turno cerrado y arqueo guardado correctamente.' });
            setIsCerrarModalOpen(false);
            setSesionActiva(null); // Bloquea la pantalla inmediatamente
            setFormCerrar({ monto_real: '', observaciones: '' }); 
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cerrar el turno.'));
        } finally { setActionLoading(false); }
    };

    return {
        sesionActiva, loadingSesion, actionLoading, alert, setAlert,
        formAbrir, setFormAbrir, handleAbrir,
        formCerrar, setFormCerrar, handleCerrar,
        isCerrarModalOpen, setIsCerrarModalOpen
    };
};