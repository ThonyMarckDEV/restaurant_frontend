import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/cajaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    
    const [formData, setFormData] = useState({ nombre: '', descripcion: '', activo: true });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setAlert(null);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Caja registrado correctamente.' });
            setTimeout(() => navigate('/caja/listar'), 1500);
        } catch (err) { setAlert(handleApiError(err, 'Error al registrar')); 
        } finally { setLoading(false); }
    };

    return { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit };
};