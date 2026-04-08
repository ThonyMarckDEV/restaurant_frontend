import React from 'react';
import { useStore } from 'hooks/venta/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import VentaForm from 'components/Shared/Formularios/venta/VentaForm';
import PdfModal from 'components/Shared/Modals/PdfModal'; 
import { BanknotesIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { 
        formData, loading, loadingOrden, alert, setAlert, ordenDetalle, 
        handleChange, handleOrdenSelect, handleSubmit, handleOrdenReset,
        pdfData, handleClosePdf, resetTrigger
    } = useStore();

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <PageHeader 
                title="Módulo de Caja - Cobrar" 
                subtitle="Selecciona una orden abierta y procesa el pago"
                icon={BanknotesIcon} 
                buttonText="Historial de Ventas" 
                buttonLink="/venta/listar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <VentaForm 
                formData={formData} loading={loading} loadingOrden={loadingOrden}
                ordenDetalle={ordenDetalle} handleChange={handleChange}
                handleOrdenSelect={handleOrdenSelect} handleSubmit={handleSubmit}
                handleOrdenReset={handleOrdenReset} resetTrigger={resetTrigger}
            />

            <PdfModal 
                isOpen={pdfData.isOpen} onClose={handleClosePdf}
                title="Ticket de Venta Generado" pdfUrl={pdfData.url}
            />
        </div>
    );
};

export default Store;