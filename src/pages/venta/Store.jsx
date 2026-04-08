import React from 'react';
import { useStore as useVentaStore } from 'hooks/venta/useStore';
import { useCajaSesion } from 'hooks/cajaSesion/useCajaSesion';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import VentaForm from 'components/Shared/Formularios/venta/VentaForm';
import PdfModal from 'components/Shared/Modals/PdfModal'; 
import AbrirTurnoScreen from 'components/Shared/Modals/AbrirTurnoScreen';
import CerrarTurnoModal from 'components/Shared/Modals/CerrarTurnoModal';
import { BanknotesIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Store = () => {
    // Estado de la Venta
    const { 
        formData: vForm, loading: vLoading, loadingOrden, alert: vAlert, setAlert: setVAlert, 
        ordenDetalle, handleChange: vHandleChange, handleOrdenSelect, handleSubmit: vHandleSubmit, 
        handleOrdenReset, pdfData, handleClosePdf, resetTrigger
    } = useVentaStore();

    // Estado de la Sesión de Caja
    const {
        sesionActiva, loadingSesion, actionLoading, alert: cAlert, setAlert: setCAlert,
        formAbrir, setFormAbrir, handleAbrir,
        formCerrar, setFormCerrar, handleCerrar,
        isCerrarModalOpen, setIsCerrarModalOpen
    } = useCajaSesion();

    // Si está validando la sesión inicial, mostramos un loader
    if (loadingSesion) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-black uppercase tracking-widest">Verificando Caja...</p>
            </div>
        );
    }

    // SI NO HAY SESIÓN: Mostrar pantalla de bloqueo
    if (!sesionActiva) {
        return (
            <AbrirTurnoScreen 
                form={formAbrir} setForm={setFormAbrir} onSubmit={handleAbrir} 
                loading={actionLoading} alert={cAlert} setAlert={setCAlert}
            />
        );
    }

    // SI HAY SESIÓN: Mostrar el POS normal
    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header con Botón Inyectado para CERRAR TURNO */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <PageHeader 
                    title="Módulo de Caja - Cobrar" 
                    subtitle={`Turno Abierto: ${sesionActiva.caja?.nombre}`}
                    icon={BanknotesIcon} 
                />
                <button 
                    onClick={() => setIsCerrarModalOpen(true)}
                    className="bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm border border-rose-200"
                >
                    <LockClosedIcon className="w-4 h-4" /> Cerrar Turno
                </button>
            </div>
            
            {/* Alertas de Venta (o del Cierre si falla) */}
            <AlertMessage type={vAlert?.type || cAlert?.type} message={vAlert?.message || cAlert?.message} onClose={() => { setVAlert(null); setCAlert(null); }} />

            <VentaForm 
                formData={vForm} loading={vLoading} loadingOrden={loadingOrden}
                ordenDetalle={ordenDetalle} handleChange={vHandleChange}
                handleOrdenSelect={handleOrdenSelect} handleSubmit={vHandleSubmit}
                handleOrdenReset={handleOrdenReset} resetTrigger={resetTrigger}
            />

            <PdfModal isOpen={pdfData.isOpen} onClose={handleClosePdf} title="Ticket de Venta Generado" pdfUrl={pdfData.url} />

            {/* Modal de Arqueo */}
            <CerrarTurnoModal 
                isOpen={isCerrarModalOpen} onClose={() => setIsCerrarModalOpen(false)}
                form={formCerrar} setForm={setFormCerrar} onSubmit={handleCerrar}
                loading={actionLoading} sesionActiva={sesionActiva}
            />
        </div>
    );
};

export default Store;