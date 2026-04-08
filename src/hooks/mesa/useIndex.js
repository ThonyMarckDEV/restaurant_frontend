import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show, toggleStatus, destroy } from 'services/mesaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [mesas, setMesas] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    
    const [filters, setFilters] = useState({ search: '', activo: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ show: false, id: null, type: '' });

    const fetchMesas = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setMesas(response.data || []);
            setPaginationInfo({ currentPage: response.current_page, totalPages: response.last_page, total: response.total });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar las mesas'));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchMesas(1); }, [fetchMesas]);

    const handleView = async (id) => {
        setIsViewOpen(true); setViewLoading(true);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) {
            setAlert(handleApiError(err));
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
                setAlert({ type: 'success', message: 'Mesa eliminada.' });
            }
            await fetchMesas(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err, 'Error en la operación'));
        } finally { setLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchMesas(1); };
    const handleFilterClear = () => {
        const reset = { search: '', activo: '1', estado: '' }; // Vuelve al valor por defecto
        setFilters(reset); filtersRef.current = reset; fetchMesas(1);
    };

    return {
        loading, mesas, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, confirmAction, setConfirmAction,
        fetchMesas, handleView, handleAskStatus, handleAskDelete, handleConfirmAction,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};