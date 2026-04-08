// src/hooks/mesa/useStore.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store, index } from 'services/mesaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [existingMesas, setExistingMesas] = useState([]);

    const [formData, setFormData] = useState({ 
        numero: '', 
        capacidad: 4, 
        pos_x: 50, 
        pos_y: 50 
    });

    // Cargar las mesas existentes para el croquis
    useEffect(() => {
        const loadExistingMesas = async () => {
            try {
                const response = await index(1, { activo: 'true' }); 
                setExistingMesas(response.data || []);
            } catch (err) {
                console.error("Error cargando mesas para el mapa", err);
            }
        };
        loadExistingMesas();
    }, []);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Mesa registrada exitosamente.' });
            setTimeout(() => navigate('/mesa/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar la mesa'));
        } finally { setLoading(false); }
    };

    return { formData, setFormData, loading, alert, setAlert, existingMesas, handleChange, handleSubmit };
};