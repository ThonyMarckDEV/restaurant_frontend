import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/platoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        categoria_id: '',
        categoria_nombre: '', // Solo para la UI del combobox
        precio_carta: '',
        es_para_menu: true, // Por defecto asumimos que se puede vender en menú
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
            setAlert({ type: 'success', message: 'Plato registrado correctamente.' });
            setTimeout(() => navigate('/plato/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar el plato'));
        } finally { setLoading(false); }
    };

    return { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit };
};