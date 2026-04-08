import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/proveedorService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        ruc: '', 
        razon_social: '',
        nombre_contacto: '',
        telefono: '',
        correo: '',
        direccion: ''
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
            setAlert({ type: 'success', message: 'Proveedor registrado exitosamente. Redirigiendo...' });
            setTimeout(() => navigate('/proveedor/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar el proveedor'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, alert, setAlert, handleChange, handleSubmit };
};