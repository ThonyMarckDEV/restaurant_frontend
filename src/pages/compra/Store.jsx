import React from 'react';
import { useStore } from 'hooks/compra/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import CompraForm from 'components/Shared/Formularios/compra/CompraForm';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { 
        formData, setFormData, loading, alert, setAlert, 
        handleChange, addDetalle, updateDetalle, removeDetalle, 
        totales, handleSubmit 
    } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Nueva Compra" icon={ShoppingCartIcon} buttonText="Volver a Compras" buttonLink="/compra/listar" />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            {/* Llamamos al nuevo componente y le pasamos las props */}
            <CompraForm 
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                handleChange={handleChange}
                addDetalle={addDetalle}
                updateDetalle={updateDetalle}
                removeDetalle={removeDetalle}
                totales={totales}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default Store;