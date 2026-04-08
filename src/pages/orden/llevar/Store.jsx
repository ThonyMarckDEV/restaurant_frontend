import React from 'react';
import { useStore } from 'hooks/orden/llevar/useStore';
import OrdenForm from 'components/Shared/Formularios/orden/OrdenForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PdfModal from 'components/Shared/Modals/PdfModal';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { 
        cart, setCart, alert, setAlert, handleSubmit, 
        orderConfig, updateConfig, pdfData, handleClosePdf 
    } = useStore();

    return (
        <div className="container mx-auto p-4 md:p-6 pb-24 lg:pb-6 relative">
            <PageHeader
                title="Nueva Comanda - Para Llevar"
                icon={ShoppingBagIcon}
                buttonText="Volver a Caja"
                buttonLink="/venta/crear"
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <div className="mt-4">
                <OrdenForm
                    cart={cart} setCart={setCart}
                    orderConfig={orderConfig} updateConfig={updateConfig}
                    onSave={handleSubmit} setAlert={setAlert}
                />
            </div>

            {/* Modal para imprimir Comanda al instante */}
            <PdfModal 
                isOpen={pdfData.isOpen}
                onClose={handleClosePdf}
                title="Impresión de Comanda (Cocina)"
                pdfUrl={pdfData.url}
            />
        </div>
    );
};

export default Store;