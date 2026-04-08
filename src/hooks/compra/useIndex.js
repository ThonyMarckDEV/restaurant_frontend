import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show, destroy } from 'services/compraService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [compras, setCompras] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', proveedor_id: '', proveedorNombre: '', fecha: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    // Estados para el Modal de Detalle
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    // NUEVO: Estados para el Modal de Confirmación
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const fetchCompras = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setCompras(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar historial de compras'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCompras(1); }, [fetchCompras]);

    const handleView = async (id) => {
        setIsViewOpen(true);
        setViewLoading(true);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) {
            setAlert(handleApiError(err));
            setIsViewOpen(false);
        } finally {
            setViewLoading(false);
        }
    };

    // Abre el modal de confirmación
    const openConfirmAnular = (id) => {
        setSelectedId(id);
        setIsConfirmOpen(true);
    };

    // Ejecuta la anulación real
    const handleDelete = async () => {
        if (!selectedId) return;
        setIsConfirmOpen(false); // Cerramos el modal primero
        try {
            await destroy(selectedId);
            setAlert({ type: 'success', message: 'Compra anulada correctamente. El stock ha sido revertido.' });
            fetchCompras(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setSelectedId(null);
        }
    };

    const canCancel = (createdAt) => {
        if (!createdAt) return false;
        const created = new Date(createdAt);
        const now = new Date();
        const diffInHours = (now - created) / (1000 * 60 * 60);
        return diffInHours < 24;
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({...prev, [name]: val}));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchCompras(1); };
    const handleFilterClear = () => {
        const reset = { 
            search: '', 
            proveedor_id: '', 
            proveedorNombre: '',
            fecha: '', 
            estado: '' 
        };
        setFilters(reset); 
        filtersRef.current = reset; 
        fetchCompras(1);
    };

    return {
        loading, compras, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading,
        isConfirmOpen, setIsConfirmOpen, // Exportamos estados del modal
        fetchCompras, handleView, handleFilterChange, handleFilterSubmit, handleFilterClear,
        handleDelete, openConfirmAnular, canCancel
    };
};