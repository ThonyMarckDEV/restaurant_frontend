import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show, toggleStatus, destroy } from 'services/adicionalService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [adicionales, setAdicionales] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ show: false, id: null, type: '' });

    const fetchAdicionales = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setAdicionales(response.data || []);
            setPaginationInfo({ currentPage: response.current_page, totalPages: response.last_page, total: response.total });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar adicionales'));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchAdicionales(1); }, [fetchAdicionales]);

    const handleView = async (id) => {
        setIsViewOpen(true); setViewLoading(true);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar detalles'));
            setIsViewOpen(false);
        } finally { setViewLoading(false); }
    };

    const handleAskStatus = (id) => setConfirmAction({ show: true, id, type: 'status' });
    const handleAskDelete = (id) => setConfirmAction({ show: true, id, type: 'delete' });

    const handleConfirmAction = async () => {
        const { id, type } = confirmAction;
        setConfirmAction({ show: false, id: null, type: '' });
        setLoading(true);
        try {
            if (type === 'status') {
                await toggleStatus(id);
                setAlert({ type: 'success', message: 'Estado actualizado.' });
            } else {
                await destroy(id);
                setAlert({ type: 'success', message: 'Adicional eliminado.' });
            }
            await fetchAdicionales(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err, 'Error en la operación'));
        } finally { setLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchAdicionales(1); };
    const handleFilterClear = () => {
        const reset = { search: '', estado: '' };
        setFilters(reset); filtersRef.current = reset; fetchAdicionales(1);
    };

    return {
        loading, adicionales, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, confirmAction, setConfirmAction,
        fetchAdicionales, handleView, handleAskStatus, handleAskDelete, handleConfirmAction,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};