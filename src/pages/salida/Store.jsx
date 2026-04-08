import React from 'react';
import { useStore } from 'hooks/salida/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import SalidaForm from 'components/Shared/Formularios/salida/SalidaForm';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, setFormData, loading, alert, setAlert, handleChange, addItem, updateItem, removeItem, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Registrar Salida de Insumos" subtitle="Consumo cocina, mermas o ajustes manuales" icon={ArrowUpRightIcon} buttonText="Volver al Listado" buttonLink="/salida/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <SalidaForm formData={formData} setFormData={setFormData} loading={loading} handleChange={handleChange} addItem={addItem} updateItem={updateItem} removeItem={removeItem} handleSubmit={handleSubmit} />
        </div>
    );
};
export default Store;