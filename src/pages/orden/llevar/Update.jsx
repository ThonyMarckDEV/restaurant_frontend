import React from 'react';
import { useUpdate } from 'hooks/orden/llevar/useUpdate';
import OrdenForm from 'components/Shared/Formularios/orden/OrdenForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import PdfModal from 'components/Shared/Modals/PdfModal';
import { PencilSquareIcon, ShoppingBagIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Update = () => {
    const { 
        cart, setCart, ordenData, loading, alert, setAlert, 
        isClosed, orderConfig, updateConfig, pdfData, setPdfData 
    } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 md:p-6 relative">
            {isClosed && (
                <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-200 text-center animate-pulse">
                        <span className="text-2xl mb-2 block">🔒</span>
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">Orden Bloqueada</h2>
                        <p className="text-xs font-bold text-slate-500 mt-1">Cerrando sistema de edición...</p>
                    </div>
                </div>
            )}
            
            <div className={`transition-opacity duration-300 ${isClosed ? 'opacity-30 pointer-events-none' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <PageHeader
                        title={`Orden #${ordenData?.id}`}
                        subtitle="Para Llevar" 
                        icon={PencilSquareIcon}
                    />
                    <div className="flex gap-2">
                        <Link to="/venta/crear" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 text-sm uppercase transition-colors">
                            <ShoppingBagIcon className="w-5 h-5" /> Caja
                        </Link>
                        <Link to="/orden/llevar/listar" className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-xl font-bold border border-slate-200 text-sm uppercase shadow-sm transition-colors hover:bg-slate-50">
                            <ChevronLeftIcon className="w-5 h-5" /> Salir
                        </Link>
                    </div>
                </div>
                
                <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
                
                <div className="mt-4">
                    <OrdenForm cart={cart} setCart={setCart} orderConfig={orderConfig} updateConfig={updateConfig} setAlert={setAlert} />
                </div>
            </div>

            {/* Modal para imprimir Comanda Actualizada */}
            <PdfModal 
                isOpen={pdfData.isOpen}
                onClose={() => setPdfData({ isOpen: false, url: null })}
                title="Imprimir Cambios (Cocina)"
                pdfUrl={pdfData.url}
            />
        </div>
    );
};

export default Update;