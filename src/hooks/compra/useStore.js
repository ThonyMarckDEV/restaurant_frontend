import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/compraService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        proveedor_id: '',
        proveedorNombre: '',
        tipo_comprobante: 'Factura',
        serie_comprobante: '',
        num_comprobante: '',
        fecha_compra: new Date().toISOString().split('T')[0],
        observacion: '',
        detalles: [] // Aquí van los insumos comprados
    });

    // Cálculos automáticos
    const totales = useMemo(() => {
        const subtotal = formData.detalles.reduce((acc, item) => acc + (parseFloat(item.subtotal) || 0), 0);
        return { total: subtotal.toFixed(2) };
    }, [formData.detalles]);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const addDetalle = (insumo) => {
        // Evitar duplicados en la misma compra
        if (formData.detalles.find(d => d.insumo_id === insumo.id)) return;

        const nuevoDetalle = {
            insumo_id: insumo.id,
            nombre: insumo.nombre,
            unidad_compra: insumo.unidad_compra?.abreviatura,
            factor_conversion: insumo.factor_conversion,
            cantidad: 1,
            precio_unitario: insumo.costo_referencial || 0,
            subtotal: insumo.costo_referencial || 0,
            insumo_original: insumo
        };
        setFormData(prev => ({ ...prev, detalles: [...prev.detalles, nuevoDetalle] }));
    };

    const updateDetalle = (index, field, value) => {
        const nuevosDetalles = [...formData.detalles];
        nuevosDetalles[index][field] = value;
        nuevosDetalles[index].subtotal = (nuevosDetalles[index].cantidad * nuevosDetalles[index].precio_unitario).toFixed(2);
        setFormData(prev => ({ ...prev, detalles: nuevosDetalles }));
    };

    const removeDetalle = (index) => {
        setFormData(prev => ({ ...prev, detalles: prev.detalles.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.detalles.length === 0) return setAlert({ type: 'error', message: 'Debes agregar al menos un insumo.' });

        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Compra registrada y stock actualizado.' });
            setTimeout(() => navigate('/compra/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    };

    return { formData, setFormData, loading, alert, setAlert, handleChange, addDetalle, updateDetalle, removeDetalle, totales, handleSubmit };
};