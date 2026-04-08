import { useState, useEffect, useCallback, useRef } from 'react';
import { index, toggleStatus, destroy } from 'services/cajaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);
    const [confirmAction, setConfirmAction] = useState({ show: false, id: null, type: '' });

    const fetchRecords = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setRecords(response.data || []);
            setPaginationInfo({ currentPage: response.current_page, totalPages: response.last_page, total: response.total });
        } catch (err) { setAlert(handleApiError(err, 'Error al cargar los registros'));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchRecords(1); }, [fetchRecords]);

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
                setAlert({ type: 'success', message: 'Registro eliminado.' });
            }
            await fetchRecords(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err, 'Error en la operación'));
        } finally { setLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchRecords(1); };
    const handleFilterClear = () => {
        const reset = { search: '' };
        setFilters(reset); filtersRef.current = reset; fetchRecords(1);
    };

    return {
        loading, records, paginationInfo, filters, setFilters, alert, setAlert,
        confirmAction, setConfirmAction, fetchRecords, handleAskStatus, handleAskDelete,
        handleConfirmAction, handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};