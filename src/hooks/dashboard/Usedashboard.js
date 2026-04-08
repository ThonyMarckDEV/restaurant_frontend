import { useState, useEffect, useCallback } from 'react';
import { getDashboardData } from 'services/dashboardService';
import { toast } from 'react-toastify';

const PERIODOS = ['hoy', 'semana', 'mes', 'año'];

export const useDashboard = () => {
    const [data, setData]       = useState(null);
    const [periodo, setPeriodo] = useState('mes');
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const cargar = useCallback(async (p = periodo) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getDashboardData({ periodo: p });
            setData(res.data ?? res);
        } catch (err) {
            console.error('Error cargando dashboard', err);
            setError('No se pudo cargar el dashboard');
            toast.error('Error al cargar el dashboard');
        } finally {
            setLoading(false);
        }
    }, [periodo]);

    useEffect(() => { cargar(periodo); }, [periodo, cargar]);

    const cambiarPeriodo = (nuevoPeriodo) => {
        if (PERIODOS.includes(nuevoPeriodo)) setPeriodo(nuevoPeriodo);
    };

    return { data, loading, error, periodo, cambiarPeriodo, recargar: () => cargar(periodo) };
};