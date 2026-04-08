import React from 'react';
import { useStore } from 'hooks/mesa/useStore';
import MesaForm from 'components/Shared/Formularios/mesa/MesaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { MapIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, setFormData, loading, alert, setAlert, existingMesas, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Nueva Mesa" icon={MapIcon} buttonText="Volver" buttonLink="/mesa/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
                <MesaForm 
                    form={formData} 
                    setForm={setFormData} 
                    handleChange={handleChange} 
                    existingMesas={existingMesas} 
                />
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 shadow-lg">
                        {loading ? 'Guardando...' : 'Registrar Mesa'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;