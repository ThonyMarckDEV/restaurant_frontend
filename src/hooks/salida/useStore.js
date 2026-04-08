import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/salidaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        almacen_id: '',
        almacen_nombre: '',
        tipo_movimiento: 3, // Default: Consumo Cocina
        observacion: '',
        items: []
    });

    // --- CORRECCIÓN AQUÍ ---
    // Limpiar items si cambia el almacén de origen
    useEffect(() => {
        setFormData(prev => {
            // Solo actualizamos si realmente hay algo que limpiar
            if (prev.items.length > 0) {
                return { ...prev, items: [] };
            }
            return prev;
        });
    }, [formData.almacen_id]); 
    // Ahora solo depende de almacen_id y es seguro

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const addItem = (insumo) => {
        if (formData.items.find(i => i.insumo_id === insumo.id)) return;
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                insumo_id: insumo.id,
                nombre: insumo.nombre,
                abreviatura: insumo.unidad_medida?.abreviatura,
                cantidad: 1,
                insumo_original: insumo
            }]
        }));
    };

    const updateItem = (index, field, value) => {
        const nuevosItems = [...formData.items];
        nuevosItems[index][field] = value;
        setFormData(prev => ({ ...prev, items: nuevosItems }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.items.length === 0) return setAlert({ type: 'error', message: 'Agrega al menos un insumo.' });
        
        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Salida registrada correctamente.' });
            setTimeout(() => navigate('/salida/listar'), 1500);
        } catch (err) { 
            setAlert(handleApiError(err)); 
        } finally { 
            setLoading(false); 
        }
    };

    return { formData, setFormData, loading, alert, setAlert, handleChange, addItem, updateItem, removeItem, handleSubmit };
};