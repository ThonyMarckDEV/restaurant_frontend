import React from 'react';
import { useStore } from 'hooks/unidadMedida/useStore';

import UnidadMedidaForm from 'components/Shared/Formularios/unidadMedida/UnidadMedidaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { ScaleIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Nueva Unidad de Medida" 
                icon={ScaleIcon} 
                buttonText="Volver al Listado" 
                buttonLink="/unidad-medida/listar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <UnidadMedidaForm form={formData} handleChange={handleChange} />

                <div className="mt-8 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="bg-black text-white px-8 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-lg"
                    >
                        {loading ? 'Guardando...' : 'Registrar Unidad'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;