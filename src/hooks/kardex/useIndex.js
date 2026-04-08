import { useState, useEffect, useCallback, useRef } from 'react';
import { index } from 'services/kardexService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(false);
    const [movimientos, setMovimientos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    
    // Estado inicial de los filtros
    const [filters, setFilters] = useState({ 
        insumo_id: '', 
        insumo_nombre: '', 
        almacen_id: '', 
        almacen_nombre: '', 
        tipo_movimiento: '',
        fecha_inicio: '',
        fecha_fin: ''
    });
    
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const fetchMovimientos = useCallback(async (page = 1) => {
        // YA NO HAY RESTRICCIÓN AQUÍ, BUSCA TODO DE FRENTE
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setMovimientos(response.data || []);
            setPaginationInfo({ 
                currentPage: response.current_page, 
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los movimientos del Kardex'));
        } finally { 
            setLoading(false); 
        }
    }, []);

    useEffect(() => { 
        fetchMovimientos(1); 
    }, [fetchMovimientos]);

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };
    
    const handleFilterSubmit = () => { 
        // YA NO TE OBLIGA A ELEGIR UN INSUMO
        setAlert(null);
        filtersRef.current = filters; 
        fetchMovimientos(1); 
    };
    
    const handleFilterClear = () => {
        const reset = { 
            insumo_id: '', 
            insumo_nombre: '', 
            almacen_id: '', 
            almacen_nombre: '', 
            tipo_movimiento: '', 
            fecha_inicio: '', 
            fecha_fin: '' 
        };
        setFilters(reset); 
        filtersRef.current = reset; 
        fetchMovimientos(1); // QUE VUELVA A BUSCAR TODO AL LIMPIAR
    };

    return {
        loading, movimientos, paginationInfo, filters, setFilters, alert, setAlert,
        fetchMovimientos, handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};