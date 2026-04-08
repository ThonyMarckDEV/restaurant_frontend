import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show, toggleStatus } from 'services/proveedorService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [proveedores, setProveedores] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    const [filters, setFilters] = useState({ search: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [idToToggle, setIdToToggle] = useState(null);

    const fetchProveedores = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setProveedores(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los proveedores'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchProveedores(1); 
    }, [fetchProveedores]);

    // <-- NUEVA FUNCIÓN PARA VER DETALLE -->
    const handleView = async (id) => {
        setIsViewOpen(true);
        setViewLoading(true);
        setViewData(null);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar detalles del proveedor'));
            setIsViewOpen(false);
        } finally {
            setViewLoading(false);
        }
    };

    const handleAskToggle = (id) => {
        setIdToToggle(id);
        setShowConfirm(true);
    };

    const handleConfirmToggle = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await toggleStatus(idToToggle);
            setAlert({ type: 'success', message: 'Estado del proveedor actualizado correctamente.' });
            await fetchProveedores(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar el estado'));
        } finally {
            setLoading(false);
            setIdToToggle(null);
        }
    };

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchProveedores(1);
    };

    const handleFilterClear = () => {
        const reset = { search: '', estado: '' }; 
        setFilters(reset); 
        filtersRef.current = reset; 
        fetchProveedores(1);
    };

    return {
        loading, proveedores, paginationInfo, filters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, handleView,
        showConfirm, setShowConfirm, setIdToToggle, fetchProveedores, 
        handleAskToggle, handleConfirmToggle, handleFilterChange, 
        handleFilterSubmit, handleFilterClear
    };
};