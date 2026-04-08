import React from 'react';
import { useStore } from 'hooks/traspaso/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import TraspasoForm from 'components/Shared/Formularios/traspaso/TraspasoForm';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { 
        formData, 
        setFormData, 
        loading, 
        alert, 
        setAlert, 
        handleChange, 
        addItem, 
        updateItem, 
        removeItem, 
        handleSubmit 
    } = useStore();

    return (
        <div className="container mx-auto p-6">
            {/* Cabecera de la página con botón para volver */}
            <PageHeader 
                title="Nuevo Traspaso de Stock" 
                subtitle="Mueve insumos entre tus almacenes registrados"
                icon={ArrowsRightLeftIcon} 
                buttonText="Volver al Listado" 
                buttonLink="/traspaso/listar" 
            />
            
            {/* Mensajes de éxito o error (API o validaciones) */}
            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                details={alert?.details} 
                onClose={() => setAlert(null)} 
            />

            {/* Formulario de Traspaso pasándole todas las props del Hook */}
            <TraspasoForm 
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                handleChange={handleChange}
                addItem={addItem}
                updateItem={updateItem}
                removeItem={removeItem}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default Store;