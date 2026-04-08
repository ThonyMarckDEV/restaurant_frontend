import { useState, useEffect, useCallback, useRef } from 'react';
import { index, destroy, show } from 'services/ordenService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [ordenes, setOrdenes] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    
    const [filters, setFilters] = useState({ estado: '', tipo_pedido: '1', fecha: '' });
    const filtersRef = useRef(filters);
    
    const [alert, setAlert] = useState(null);
    const [confirmAction, setConfirmAction] = useState({ show: false, id: null, type: '' });
    const [viewDetail, setViewDetail] = useState({ isOpen: false, data: null, isLoading: false });

    const fetchOrdenes = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setOrdenes(response.data || []);
            setPaginationInfo({ 
                currentPage: response.current_page, 
                totalPages: response.last_page, 
                total: response.total 
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar historial de salón'));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOrdenes(1); }, [fetchOrdenes]);

    const handleOpenViewModal = async (id) => {
        setViewDetail({ isOpen: true, data: null, isLoading: true });
        try {
            const res = await show(id);
            setViewDetail(prev => ({ ...prev, data: res.data || res, isLoading: false }));
        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudo cargar el detalle.' });
            setViewDetail({ isOpen: false, data: null, isLoading: false });
        }
    };

    const handleCloseViewModal = () => setViewDetail({ isOpen: false, data: null, isLoading: false });

    const handleAskDelete = (id) => setConfirmAction({ show: true, id, type: 'delete' });

    const handleConfirmAction = async () => {
        const { id } = confirmAction;
        setConfirmAction({ show: false, id: null, type: '' });
        setLoading(true);
        try {
            await destroy(id); 
            setAlert({ type: 'success', message: 'Orden de salón anulada y mesa liberada.' });
            await fetchOrdenes(paginationInfo.currentPage);
        } catch (err) { 
            setAlert(handleApiError(err, 'Error al anular la orden')); 
        } finally { setLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchOrdenes(1); };
    
    const handleFilterClear = () => {
        // 🔥 Reseteamos manteniendo tipo_pedido: '1'
        const reset = { estado: '', tipo_pedido: '1', fecha: '' };
        setFilters(reset); filtersRef.current = reset; fetchOrdenes(1);
    };

    return {
        loading, ordenes, paginationInfo, filters, setFilters, alert, setAlert,
        confirmAction, setConfirmAction, fetchOrdenes, handleAskDelete, 
        handleConfirmAction, handleFilterChange, handleFilterSubmit, handleFilterClear,
        viewDetail, handleOpenViewModal, handleCloseViewModal
    };
};