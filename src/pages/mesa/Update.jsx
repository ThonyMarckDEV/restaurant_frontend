import React from 'react';
import { useUpdate } from 'hooks/mesa/useUpdate';
import MesaForm from 'components/Shared/Formularios/mesa/MesaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const { formData, setFormData, loading, saving, alert, setAlert, existingMesas, handleChange, handleSubmit, navigate } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Editar Mesa" subtitle={`Editando: ${formData.numero}`} icon={PencilSquareIcon} buttonText="Cancelar" buttonLink="/mesa/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
                <MesaForm 
                    form={formData} 
                    setForm={setFormData} 
                    handleChange={handleChange} 
                    existingMesas={existingMesas} 
                />
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/mesa/listar')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 uppercase text-sm">Cancelar</button>
                    <button type="submit" disabled={saving} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 shadow-lg">
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Update;