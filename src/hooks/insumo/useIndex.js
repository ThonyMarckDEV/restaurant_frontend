import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show, toggleStatus, destroy } from 'services/insumoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [insumos, setInsumos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ 
        search: '', estado: '', unidad_medida_id: '', unidadMedidaNombre: '',
        es_inventariable: '', es_venta_directa: '' // <-- AGRÉGALE ESTO
    });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    const [confirmAction, setConfirmAction] = useState({ show: false, id: null, type: '' });

    const fetchInsumos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setInsumos(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los insumos'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchInsumos(1); }, [fetchInsumos]);

    const handleView = async (id) => {
        setIsViewOpen(true);
        setViewLoading(true);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar detalles'));
            setIsViewOpen(false);
        } finally {
            setViewLoading(false);
        }
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
                setAlert({ type: 'success', message: 'Insumo eliminado.' });
            }
            await fetchInsumos(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error en la operación'));
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchInsumos(1); };
    const handleFilterClear = () => {
        const reset = { 
            search: '', 
            estado: '', 
            unidad_medida_id: '', 
            unidadMedidaNombre: '',
            es_inventariable: '', // TIENE QUE ESTAR AQUÍ
            es_venta_directa: ''  // TIENE QUE ESTAR AQUÍ
        };
        setFilters(reset); 
        filtersRef.current = reset; 
        fetchInsumos(1);
    };

    return {
        loading, insumos, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, confirmAction, setConfirmAction,
        fetchInsumos, handleView, handleAskStatus, handleAskDelete, handleConfirmAction,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};