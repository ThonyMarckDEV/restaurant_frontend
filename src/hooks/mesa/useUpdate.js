import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update, index } from 'services/mesaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);
    const [existingMesas, setExistingMesas] = useState([]); 

    const [formData, setFormData] = useState({ 
        numero: '', 
        capacidad: 4,
        pos_x: 50,
        pos_y: 50
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Cargamos la mesa actual
                const responseMesa = await show(id);
                const data = responseMesa.data || responseMesa;
                setFormData({ 
                    numero: data.numero, 
                    capacidad: data.capacidad,
                    pos_x: data.pos_x || 50,
                    pos_y: data.pos_y || 50
                });

                // 🔥 2. CORRECCIÓN: Traemos TODAS las mesas activas, no solo las de estado 1
                const responseAll = await index(1, { activo: 1 }); 
                
                // Extraemos el array y filtramos la mesa que estamos editando
                const dataMesas = responseAll.data || [];
                const otrasMesas = dataMesas.filter(m => Number(m.id) !== Number(id));
                
                setExistingMesas(otrasMesas);

            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar la data.'));
            } finally { setLoading(false); }
        };
        if (id) loadData();
    }, [id]);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Mesa actualizada correctamente.' });
            setTimeout(() => navigate('/mesa/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar'));
        } finally { setSaving(false); }
    };

    return { formData, setFormData, loading, saving, alert, setAlert, existingMesas, handleChange, handleSubmit, navigate };
};