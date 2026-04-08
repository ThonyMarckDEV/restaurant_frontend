import { useState, useEffect, useCallback, useRef } from 'react';
import { index, destroy, show } from 'services/ordenService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [ordenes, setOrdenes] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    
    const [filters, setFilters] = useState({ estado: '', tipo_pedido: '2', fecha: '' });
    const filtersRef = useRef(filters);
    
    const [alert, setAlert] = useState(null);
    const [confirmAction, setConfirmAction] = useState({ show: false, id: null, type: '' });
    const [viewDetail, setViewDetail] = useState({ isOpen: false, data: null, isLoading: false });
    
    const [pdfData, setPdfData] = useState({ isOpen: false, url: null });

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
            setAlert(handleApiError(err, 'Error al cargar órdenes'));
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

    // Helper para convertir Base64 a Blob
    const base64ToBlob = (base64, type) => {
        const bin = atob(base64);
        const len = bin.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        return new Blob([arr], { type });
    };

    const handleConfirmAction = async () => {
        const { id } = confirmAction;
        setConfirmAction({ show: false, id: null, type: '' });
        setLoading(true);
        try {
            const response = await destroy(id); 
            
            setAlert({ type: 'success', message: 'Orden anulada correctamente. Imprimiendo ticket...' });
            await fetchOrdenes(paginationInfo.currentPage);

            const pdfString = response?.pdf || response?.data?.pdf || response?.data?.data?.pdf;

            if (pdfString) {
                const blob = base64ToBlob(pdfString, 'application/pdf');
                const url = URL.createObjectURL(blob);
                setPdfData({ isOpen: true, url });
            }

        } catch (err) { 
            setAlert(handleApiError(err, 'Error al anular la orden')); 
        } finally { setLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchOrdenes(1); };
    
    const handleFilterClear = () => {
        const reset = { estado: '', tipo_pedido: '2', fecha: '' };
        setFilters(reset); filtersRef.current = reset; fetchOrdenes(1);
    };

    return {
        loading, ordenes, paginationInfo, filters, setFilters, alert, setAlert,
        confirmAction, setConfirmAction, fetchOrdenes, handleAskDelete, 
        handleConfirmAction, handleFilterChange, handleFilterSubmit, handleFilterClear,
        viewDetail, handleOpenViewModal, handleCloseViewModal,
        pdfData, setPdfData
    };
};