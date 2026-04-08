import React from 'react';
import { useUpdate } from 'hooks/caja/useUpdate';
import CajaForm from 'components/Shared/Formularios/caja/CajaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const { formData, setFormData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title={`Editar Caja`} subtitle={`Editando registro`} icon={PencilSquareIcon} buttonText="Cancelar" buttonLink={`/caja/listar`} />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                <CajaForm form={formData} setForm={setFormData} handleChange={handleChange} />
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(`/caja/listar`)} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 uppercase text-sm">
                        Cancelar
                    </button>
                    <button type="submit" disabled={saving} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg disabled:opacity-50 hover:bg-zinc-800 transition-all">
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Update;