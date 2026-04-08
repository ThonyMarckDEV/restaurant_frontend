import React from 'react';
import { useStore } from 'hooks/proveedor/useStore';

import ProveedorForm from 'components/Shared/Formularios/proveedor/ProveedorForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Nuevo Proveedor" 
                icon={BuildingOfficeIcon} 
                buttonText="Volver al Listado" 
                buttonLink="/proveedor/listar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <ProveedorForm form={formData} handleChange={handleChange} />

                <div className="mt-8 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="bg-black text-white px-8 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-lg"
                    >
                        {loading ? 'Guardando...' : 'Registrar Proveedor'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;