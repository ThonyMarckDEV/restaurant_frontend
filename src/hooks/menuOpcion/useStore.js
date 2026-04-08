import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/menuOpcionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        menu_id: '', menu_nombre: '',
        plato_id: '', plato_nombre: '',
        disponible: true
    });

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setAlert(null);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Opción asignada correctamente.' });
            setTimeout(() => navigate('/menu-opcion/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al asignar opción'));
        } finally { setLoading(false); }
    };

    return { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit };
};