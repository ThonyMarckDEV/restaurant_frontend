import React from 'react';
import CajaSearchSelect from 'components/Shared/Comboboxes/CajaSearchSelect';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { ArchiveBoxIcon, CurrencyDollarIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const AbrirTurnoScreen = ({ form, setForm, onSubmit, loading, alert, setAlert }) => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-md w-full relative overflow-hidden">
                {/* Decoración superior */}
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-900"></div>
                
                <div className="text-center mb-8">
                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                        <LockClosedIcon className="w-8 h-8 text-slate-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Caja Cerrada</h2>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Debes abrir un turno para vender</p>
                </div>

                <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

                <form onSubmit={onSubmit} className="space-y-6 mt-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Selecciona una Caja <span className="text-red-500">*</span>
                        </label>
                        <CajaSearchSelect 
                            form={form} 
                            setForm={setForm} 
                            fieldId="caja_id" 
                            fieldNombre="caja_nombre" 
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Monto Inicial (Sencillo) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <CurrencyDollarIcon className="w-5 h-5 absolute left-3 top-3 text-slate-400"/>
                            <input
                                type="number" step="0.01" min="0"
                                value={form.monto_apertura}
                                onChange={(e) => setForm({...form, monto_apertura: e.target.value})}
                                className="w-full pl-10 p-3 text-lg font-black text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-black outline-none bg-slate-50 transition-all"
                                placeholder="0.00"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !form.caja_id || !form.monto_apertura}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <ArchiveBoxIcon className="w-5 h-5" />}
                        {loading ? 'Abriendo Turno...' : 'Abrir Turno'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AbrirTurnoScreen;