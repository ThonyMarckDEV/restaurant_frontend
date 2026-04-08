import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show, toggleStatus, destroy } from 'services/menuOpcionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [opciones, setOpciones] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ menu_id: '', menu_nombre: '', plato_id: '', plato_nombre: '', disponible: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ show: false, id: null, type: '' });

    const fetchOpciones = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setOpciones(response.data || []);
            setPaginationInfo({ currentPage: response.current_page, totalPages: response.last_page, total: response.total });
        } catch (err) { setAlert(handleApiError(err, 'Error al cargar opciones')); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOpciones(1); }, [fetchOpciones]);

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
                setAlert({ type: 'success', message: 'Disponibilidad actualizada.' });
            } else {
                await destroy(id);
                setAlert({ type: 'success', message: 'Plato quitado del menú.' });
            }
            await fetchOpciones(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err)); } 
        finally { setLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchOpciones(1); };
    const handleFilterClear = () => {
        const reset = { menu_id: '', menu_nombre: '', plato_id: '', plato_nombre: '', disponible: '' };
        setFilters(reset); filtersRef.current = reset; fetchOpciones(1);
    };

    return {
        loading, opciones, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, confirmAction, setConfirmAction,
        fetchOpciones, handleView, handleAskStatus, handleAskDelete, handleConfirmAction,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};