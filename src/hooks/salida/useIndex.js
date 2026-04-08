import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show, destroy, downloadPdf } from 'services/salidaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [salidas, setSalidas] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', almacen_id: '', tipo: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [isPdfOpen, setIsPdfOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    const fetchSalidas = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setSalidas(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar salidas'));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchSalidas(1); }, [fetchSalidas]);

    const handleView = async (id) => {
        setIsViewOpen(true); setViewLoading(true);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) { setAlert(handleApiError(err)); setIsViewOpen(false); } 
        finally { setViewLoading(false); }
    };

    const openConfirmAnular = (id) => { setSelectedId(id); setIsConfirmOpen(true); };

    const handleDelete = async () => {
        if (!selectedId) return;
        setIsConfirmOpen(false);
        try {
            await destroy(selectedId);
            setAlert({ type: 'success', message: 'Salida anulada. Stock devuelto al almacén.' });
            fetchSalidas(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err)); }
    };

    // 🔥 NUEVA FUNCIÓN: Validación de 24 horas
    const canCancel = (createdAt) => {
        if (!createdAt) return false;
        const created = new Date(createdAt);
        const now = new Date();
        const diffInHours = (now - created) / (1000 * 60 * 60);
        return diffInHours < 24;
    };

    const handlePrint = async (id) => {
        try {
            const blob = await downloadPdf(id);
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);
            setIsPdfOpen(true);
        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudo generar el PDF del ticket.' });
        }
    };

    const closePdfModal = () => {
        setIsPdfOpen(false);
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
        }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchSalidas(1); };
    const handleFilterClear = () => {
        const reset = { search: '', almacen_id: '', tipo: '', estado: '' };
        setFilters(reset); filtersRef.current = reset; fetchSalidas(1);
    };

    return { 
        loading, salidas, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, isConfirmOpen, setIsConfirmOpen,
        isPdfOpen, pdfUrl, closePdfModal, handlePrint,
        fetchSalidas, handleView, handleDelete, openConfirmAnular, 
        handleFilterChange, handleFilterSubmit, handleFilterClear,
        canCancel // 🔥 Exportamos la validación
    };
};