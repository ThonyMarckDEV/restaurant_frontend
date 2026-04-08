import { useState, useEffect, useCallback, useRef } from 'react';
import { downloadPdf } from 'services/ventaService';
import { index, destroy, show } from 'services/ventaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [ventas, setVentas] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    
    // Filtros mapeados con el backend
    const [filters, setFilters] = useState({ codigo: '', fecha: '', estado: '', metodo_pago: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    // Modal de anulación
    const [confirmAction, setConfirmAction] = useState({ show: false, id: null, type: '' });

    // Modal de vista del ticket
    const [viewDetail, setViewDetail] = useState({ isOpen: false, data: null, isLoading: false });

    // PDF
    const [isPdfOpen, setIsPdfOpen] = useState(false);
    const [pdfUrl, setPdfUrl]       = useState(null);

    const fetchVentas = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setVentas(response.data || []);
            setPaginationInfo({ 
                currentPage: response.current_page, 
                totalPages: response.last_page, 
                total: response.total 
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar el historial de ventas'));
        } finally { 
            setLoading(false); 
        }
    }, []);

    useEffect(() => { fetchVentas(1); }, [fetchVentas]);

    // ---- LÓGICA DEL TICKET (VER DETALLE) ----
    const handleOpenViewModal = async (id) => {
        setViewDetail({ isOpen: true, data: null, isLoading: true });
        try {
            const res = await show(id);
            setViewDetail(prev => ({ ...prev, data: res.data || res, isLoading: false }));
        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudo cargar el detalle del comprobante.' });
            setViewDetail({ isOpen: false, data: null, isLoading: false });
        }
    };

    const handleCloseViewModal = () => setViewDetail({ isOpen: false, data: null, isLoading: false });

    // ---- LÓGICA DE ANULACIÓN ----
    const handleAskDelete = (id) => setConfirmAction({ show: true, id, type: 'delete' });

    const handleConfirmAction = async () => {
        const { id } = confirmAction;
        setConfirmAction({ show: false, id: null, type: '' });
        setLoading(true);
        try {
            await destroy(id); 
            setAlert({ type: 'success', message: 'Venta anulada correctamente. La orden vuelve a estar pendiente.' });
            await fetchVentas(paginationInfo.currentPage);
        } catch (err) { 
            setAlert(handleApiError(err, 'Error al anular la venta')); 
        } finally { 
            setLoading(false); 
        }
    };

    // ---- LÓGICA DE FILTROS ----
    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchVentas(1); };
    const handleFilterClear = () => {
        const reset = { codigo: '', fecha: '', estado: '', metodo_pago: '' };
        setFilters(reset); 
        filtersRef.current = reset; 
        fetchVentas(1);
    };

    // --- LOGICA DE PDF -----
    const handlePrint = async (id) => {
        try {
            const blob = await downloadPdf(id);
            const url  = window.URL.createObjectURL(blob);
            setPdfUrl(url);
            setIsPdfOpen(true);
        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudo generar el PDF de la venta.' });
        }
    };

    const closePdfModal = () => {
        setIsPdfOpen(false);
        if (pdfUrl) { window.URL.revokeObjectURL(pdfUrl); setPdfUrl(null); }
    };

    return {
        loading, ventas, paginationInfo, filters, setFilters, alert, setAlert,
        confirmAction, setConfirmAction, fetchVentas, handleAskDelete, 
        handleConfirmAction, handleFilterChange, handleFilterSubmit, handleFilterClear,
        viewDetail, handleOpenViewModal, handleCloseViewModal, isPdfOpen, pdfUrl , closePdfModal , handlePrint
    };

};