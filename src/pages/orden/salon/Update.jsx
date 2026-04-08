import React from 'react';
import { useUpdate } from 'hooks/orden/salon/useUpdate';
import OrdenForm from 'components/Shared/Formularios/orden/OrdenForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import PdfModal from 'components/Shared/Modals/PdfModal';
import { PencilSquareIcon, MapIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Update = () => {
    const {
        cart, setCart, ordenData, loading, alert, setAlert,
        isClosed, orderConfig, updateConfig,
        handleSubmit,
        pdfData, handleClosePdf, handleUpdateItemStatus
    } = useUpdate();

    if (loading && !ordenData) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 md:p-6 relative">

            {isClosed && (
                <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 text-center max-w-sm">
                        <span className="text-4xl mb-4 block">🔒</span>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Orden Bloqueada</h2>
                        <p className="text-sm font-bold text-slate-500 mt-2">Esta mesa ya ha sido pagada o anulada.</p>
                        <Link to="/orden/mesas" className="mt-6 inline-block bg-gray-900 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest">
                            Volver al Mapa
                        </Link>
                    </div>
                </div>
            )}

            <div className={`transition-opacity duration-300 ${isClosed ? 'opacity-30 pointer-events-none' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <PageHeader
                        title={`Orden #${ordenData?.id?.toString().padStart(6, '0')}`}
                        subtitle={`Mesa: ${orderConfig.mesa_numero ?? '—'}`}
                        icon={PencilSquareIcon}
                    />
                    <div className="flex gap-2">
                        <Link to="/orden/mesas"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 text-sm uppercase transition-colors">
                            <MapIcon className="w-5 h-5" /> Mapa
                        </Link>
                        <Link to="/orden/salon/listar"
                            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-xl font-bold border border-slate-200 text-sm uppercase shadow-sm transition-colors hover:bg-slate-50">
                            <ChevronLeftIcon className="w-5 h-5" /> Salir
                        </Link>
                    </div>
                </div>

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
                        onUpdateStatus={handleUpdateItemStatus}
                    />
                </div>
            </div>

            <PdfModal
                isOpen={pdfData.isOpen}
                onClose={handleClosePdf}
                title="Actualización de Comanda"
                pdfUrl={pdfData.url}
            />
        </div>
    );
};

export default Update;