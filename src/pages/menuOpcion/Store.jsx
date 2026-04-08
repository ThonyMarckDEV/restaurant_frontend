import React from 'react';
import { useStore } from 'hooks/menuOpcion/useStore';
import MenuOpcionForm from 'components/Shared/Formularios/menuOpcion/MenuOpcionForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { ListBulletIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Asignar Opción" subtitle="Agrega un plato a tu menú del día" icon={ListBulletIcon} buttonText="Volver" buttonLink="/menu-opcion/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
                <MenuOpcionForm form={formData} setForm={setFormData} handleChange={handleChange} />
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 shadow-lg transition-all">
                        {loading ? 'Asignando...' : 'Guardar Opción'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;