import React from 'react';
import { useStore } from 'hooks/adicional/useStore';
import AdicionalForm from 'components/Shared/Formularios/adicional/AdicionalForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Nuevo Adicional" subtitle="Registra un nuevo complemento para los pedidos" icon={PlusCircleIcon} buttonText="Volver" buttonLink="/adicional/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
                <AdicionalForm form={formData} setForm={setFormData} handleChange={handleChange} />
                
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 shadow-lg transition-all">
                        {loading ? 'Guardando...' : 'Registrar Adicional'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;