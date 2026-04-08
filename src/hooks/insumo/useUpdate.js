import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/insumoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        unidad_medida_id: '',
        unidadMedidaNombre: '',
        unidad_compra_id: '',       
        unidadCompraNombre: '',    
        factor_conversion: '1',     
        costo_referencial: '',
        es_inventariable: true,
        es_venta_directa: false,
        precio_venta: ''
    });

    useEffect(() => {
        const loadInsumo = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    nombre: data.nombre,
                    unidad_medida_id: data.unidad_medida_id,
                    unidadMedidaNombre: data.unidad_medida?.nombre || '',
                    unidad_compra_id: data.unidad_compra_id || '',          
                    unidadCompraNombre: data.unidad_compra?.nombre || '',    
                    factor_conversion: data.factor_conversion || '1',       
                    costo_referencial: data.costo_referencial,
                    es_inventariable: data.es_inventariable,            // NUEVO
                    es_venta_directa: data.es_venta_directa,            // NUEVO
                    precio_venta: data.precio_venta || ''               // NUEVO
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar el insumo.'));
            } finally {
                setLoading(false);
            }
        };
        if (id) loadInsumo();
    }, [id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const dataToSubmit = { ...formData };
            if (!dataToSubmit.es_venta_directa) {
                dataToSubmit.precio_venta = '';
            }

            await update(id, dataToSubmit);
            setAlert({ type: 'success', message: 'Insumo actualizado correctamente.' });
            setTimeout(() => navigate('/insumo/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar'));
        } finally {
            setSaving(false);
        }
    };

    return { formData, setFormData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};