import { useState, useEffect, useCallback, useRef } from 'react';
import { index, destroy } from 'services/unidadMedidaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [unidades, setUnidades] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    const [filters, setFilters] = useState({ search: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const fetchUnidades = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setUnidades(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar las unidades de medida'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchUnidades(1); 
    }, [fetchUnidades]);

    const handleAskDelete = (id) => {
        setIdToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await destroy(idToDelete);
            setAlert({ type: 'success', message: 'Unidad de medida eliminada correctamente.' });
            await fetchUnidades(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'No se pudo eliminar la unidad'));
        } finally {
            setLoading(false);
            setIdToDelete(null);
        }
    };

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchUnidades(1);
    };

    const handleFilterClear = () => {
        const reset = { search: '' }; 
        setFilters(reset); 
        filtersRef.current = reset; 
        fetchUnidades(1);
    };

    return {
        loading, unidades, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, setIdToDelete, fetchUnidades, 
        handleAskDelete, handleConfirmDelete, handleFilterChange, 
        handleFilterSubmit, handleFilterClear
    };
};