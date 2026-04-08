import React from 'react';
import { useStore } from 'hooks/orden/salon/useStore';
import OrdenForm from 'components/Shared/Formularios/orden/OrdenForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { 
        cart, setCart, loading, alert, setAlert, 
        handleSubmit, orderConfig, updateConfig 
    } = useStore();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 md:p-6 pb-24 lg:pb-6">
            <PageHeader
                title={`Nueva Comanda - Mesa ${orderConfig.mesa_numero ?? '—'}`}
                icon={ClipboardDocumentListIcon}
                buttonText="Volver al Mapa"
                buttonLink="/orden/mesas"
            />
            
            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                details={alert?.details} 
                onClose={() => setAlert(null)} 
            />

            <div className="mt-4">
                <OrdenForm
                    cart={cart} 
                    setCart={setCart}
                    orderConfig={orderConfig} 
                    updateConfig={updateConfig}
                    onSave={handleSubmit} 
                    setAlert={setAlert}
                />
            </div>
        </div>
    );
};

export default Store;