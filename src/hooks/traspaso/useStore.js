import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/traspasoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        almacen_origen_id: '',
        almacen_origen_nombre: '',
        almacen_destino_id: '',
        almacen_destino_nombre: '',
        observacion: '',
        items: [] 
    });

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const addItem = (insumo) => {
        const listaActual = formData?.items || [];

        if (listaActual.find(i => i.insumo_id === insumo.id)) {
            return; 
        }

        const nuevoItem = {
            insumo_id: insumo.id,
            nombre: insumo.nombre,
            abreviatura: insumo.unidad_medida?.abreviatura || 'unid',
            cantidad: 1,
            insumo_original: insumo
        };

        setFormData(prev => ({ 
            ...prev, 
            items: [...(prev?.items || []), nuevoItem] 
        }));
    };

    const updateItem = (index, field, value) => {
        setFormData(prev => {
            const nuevosItems = [...(prev?.items || [])];
            if (nuevosItems[index]) {
                nuevosItems[index][field] = value;
            }
            return { ...prev, items: nuevosItems };
        });
    };

    const removeItem = (index) => {
        setFormData(prev => ({ 
            ...prev, 
            items: (prev?.items || []).filter((_, i) => i !== index) 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((formData?.items?.length || 0) === 0) {
            return setAlert({ type: 'error', message: 'Agrega al menos un insumo.' });
        }
        
        if (formData.almacen_origen_id === formData.almacen_destino_id) {
            return setAlert({ type: 'error', message: 'Los almacenes deben ser diferentes.' });
        }

        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Traspaso realizado con éxito.' });
            setTimeout(() => navigate('/traspaso/listar'), 1500);
        } catch (err) { 
            setAlert(handleApiError(err)); 
        } finally { 
            setLoading(false); 
        }
    };

    return { formData, setFormData, loading, alert, setAlert, handleChange, addItem, updateItem, removeItem, handleSubmit };
};