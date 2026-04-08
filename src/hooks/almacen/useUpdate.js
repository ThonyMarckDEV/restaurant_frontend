import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/almacenService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '', tipo: 2
    });

    useEffect(() => {
        const loadAlmacen = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    nombre: data.nombre,
                    tipo: data.tipo
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar el almacén.'));
            } finally { setLoading(false); }
        };
        if (id) loadAlmacen();
    }, [id]);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Almacén actualizado.' });
            setTimeout(() => navigate('/almacen/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar'));
        } finally { setSaving(false); }
    };

    return { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};