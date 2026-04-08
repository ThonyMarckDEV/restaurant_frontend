import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/proveedorService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        ruc: '', 
        razon_social: '',
        nombre_contacto: '',
        telefono: '',
        correo: '',
        direccion: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                
                setFormData({
                    ruc: data.ruc || '',
                    razon_social: data.razon_social || '',
                    nombre_contacto: data.nombre_contacto || '',
                    telefono: data.telefono || '',
                    correo: data.correo || '',
                    direccion: data.direccion || ''
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar el proveedor.'));
            } finally {
                setLoading(false);
            }
        };
        
        if (id) loadData();
    }, [id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setAlert(null);

        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Proveedor actualizado correctamente.' });
            setTimeout(() => navigate('/proveedor/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar el proveedor'));
        } finally {
            setSaving(false);
        }
    };

    return { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};