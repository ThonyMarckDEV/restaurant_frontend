import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/menuOpcionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        menu_id: '', menu_nombre: '',
        plato_id: '', plato_nombre: '',
        disponible: true
    });

    useEffect(() => {
        const loadOpcion = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    menu_id: data.menu_id,
                    menu_nombre: data.menu?.nombre || '',
                    plato_id: data.plato_id,
                    plato_nombre: data.plato?.nombre || '',
                    disponible: data.disponible
                });
            } catch (err) { setAlert(handleApiError(err)); } 
            finally { setLoading(false); }
        };
        if (id) loadOpcion();
    }, [id]);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Opción actualizada.' });
            setTimeout(() => navigate('/menu-opcion/listar'), 1500);
        } catch (err) { setAlert(handleApiError(err)); } 
        finally { setSaving(false); }
    };

    return { formData, setFormData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};