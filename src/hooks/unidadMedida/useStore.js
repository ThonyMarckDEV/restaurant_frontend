import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/unidadMedidaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '', 
        abreviatura: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Unidad registrada exitosamente. Redirigiendo...' });
            setTimeout(() => navigate('/unidad-medida/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar la unidad'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, alert, setAlert, handleChange, handleSubmit };
};