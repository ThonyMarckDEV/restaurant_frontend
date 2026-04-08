import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show } from 'services/cajaSesionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [sesiones, setSesiones] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ estado: '', fecha: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    // Estado para el modal de detalle
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    const fetchSesiones = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setSesiones(response.data || []);
            setPaginationInfo({ currentPage: response.current_page, totalPages: response.last_page, total: response.total });
        } catch (err) { setAlert(handleApiError(err, 'Error al cargar historial'));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchSesiones(1); }, [fetchSesiones]);

    const handleView = async (id) => {
        setIsViewOpen(true);
        setViewLoading(true);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar detalle del turno.'));
            setIsViewOpen(false);
        } finally { setViewLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchSesiones(1); };
    const handleFilterClear = () => {
        const reset = { estado: '', fecha: '' };
        setFilters(reset); filtersRef.current = reset; fetchSesiones(1);
    };

    return {
        loading, sesiones, paginationInfo, filters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading,
        fetchSesiones, handleView, handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};