import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/platoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        categoria_id: '',
        categoria_nombre: '',
        precio_carta: '',
        es_para_menu: true
    });

    useEffect(() => {
        const loadPlato = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    nombre: data.nombre,
                    categoria_id: data.categoria_id,
                    categoria_nombre: data.categoria?.nombre || '',
                    precio_carta: data.precio_carta,
                    es_para_menu: data.es_para_menu
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar el plato.'));
            } finally { setLoading(false); }
        };
        if (id) loadPlato();
    }, [id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Plato actualizado correctamente.' });
            setTimeout(() => navigate('/plato/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar el plato'));
        } finally { setSaving(false); }
    };

    return { formData, setFormData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};