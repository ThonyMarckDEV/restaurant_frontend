import { useState, useEffect, useCallback, useRef } from 'react';
import { index, updateStockMinimo } from 'services/almacenStockService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [stocks, setStocks] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({
        search: '',
        almacen_id: '',
        almacenNombre: '',
        con_stock_bajo: '',
    });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    // Estado para edición inline de stock_minimo
    const [editingId, setEditingId] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [savingId, setSavingId] = useState(null);

    const fetchStocks = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setStocks(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages:  response.last_page,
                total:       response.total,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar el stock'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStocks(1); }, [fetchStocks]);

    // Iniciar edición inline
    const startEditing = (row) => {
        setEditingId(row.id);
        setEditingValue(row.stock_minimo ?? '0');
    };

    // Cancelar edición
    const cancelEditing = () => {
        setEditingId(null);
        setEditingValue('');
    };

    // Guardar stock_minimo
    const saveStockMinimo = async (id) => {
        setSavingId(id);
        try {
            await updateStockMinimo(id, editingValue);
            setAlert({ type: 'success', message: 'Stock mínimo actualizado.' });
            setEditingId(null);
            setEditingValue('');
            fetchStocks(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar stock mínimo'));
        } finally {
            setSavingId(null);
        }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchStocks(1); };
    const handleFilterClear = () => {
        const reset = { search: '', almacen_id: '', almacenNombre: '', con_stock_bajo: '' };
        setFilters(reset);
        filtersRef.current = reset;
        fetchStocks(1);
    };

    return {
        loading, stocks, paginationInfo, filters, setFilters, alert, setAlert,
        editingId, editingValue, setEditingValue, savingId,
        startEditing, cancelEditing, saveStockMinimo,
        fetchStocks, handleFilterChange, handleFilterSubmit, handleFilterClear,
    };
};