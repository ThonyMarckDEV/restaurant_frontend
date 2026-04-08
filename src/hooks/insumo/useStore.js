import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/insumoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        unidad_medida_id: '',
        unidadMedidaNombre: '',
        unidad_compra_id: '',       
        unidadCompraNombre: '',    
        factor_conversion: '1',    
        costo_referencial: '',
        es_inventariable: true,   // NUEVO: Por defecto sí va al almacén
        es_venta_directa: false,  // NUEVO: Por defecto no se vende
        precio_venta: ''          // NUEVO
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            // Si desmarcan venta directa, limpiamos el precio de venta para que vaya como null
            const dataToSubmit = { ...formData };
            if (!dataToSubmit.es_venta_directa) {
                dataToSubmit.precio_venta = '';
            }

            await store(dataToSubmit);
            setAlert({ type: 'success', message: 'Insumo registrado correctamente.' });
            setTimeout(() => navigate('/insumo/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar insumo'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit };
};