import React from 'react';
import { useStore } from 'hooks/caja/useStore';
import CajaForm from 'components/Shared/Formularios/caja/CajaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { CubeIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title={`Nueva Caja`} icon={CubeIcon} buttonText="Volver" buttonLink={`/caja/listar`} />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                <CajaForm form={formData} setForm={setFormData} handleChange={handleChange} />
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg disabled:opacity-50 hover:bg-zinc-800 transition-all">
                        {loading ? 'Guardando...' : 'Registrar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;