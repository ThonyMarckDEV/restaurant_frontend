import React from 'react';
import ViewModal from './ViewModal';
import { CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CerrarTurnoModal = ({ isOpen, onClose, form, setForm, onSubmit, loading, sesionActiva }) => {
    return (
        <ViewModal isOpen={isOpen} onClose={onClose} title="Arqueo y Cierre de Caja" isLoading={false}>
            <form onSubmit={onSubmit} className="p-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Turno Actual</p>
                    <p className="text-sm font-bold text-slate-800 uppercase">{sesionActiva?.caja?.nombre}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        Abierto: {sesionActiva ? new Date(sesionActiva.fecha_apertura).toLocaleString('es-PE') : ''}
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 text-center">
                        ¿Cuánto efectivo hay físicamente en caja? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative max-w-xs mx-auto">
                        <CurrencyDollarIcon className="w-6 h-6 absolute left-4 top-4 text-emerald-500"/>
                        <input
                            type="number" step="0.01" min="0"
                            value={form.monto_real}
                            onChange={(e) => setForm({...form, monto_real: e.target.value})}
                            className="w-full pl-12 p-4 text-3xl text-center font-black text-emerald-700 border-2 border-emerald-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none bg-emerald-50/30 transition-all placeholder:text-emerald-200"
                            placeholder="0.00"
                            required
                            disabled={loading}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="mb-8 max-w-xs mx-auto">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Observaciones (Opcional)
                    </label>
                    <textarea 
                        value={form.observaciones}
                        onChange={(e) => setForm({...form, observaciones: e.target.value})}
                        className="w-full p-3 text-xs border border-slate-300 rounded-xl outline-none focus:border-slate-500 resize-none bg-slate-50"
                        rows="2"
                        placeholder="Ej: Faltó 1 sol por vuelto..."
                        disabled={loading}
                    ></textarea>
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl uppercase transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading || form.monto_real === ''} className="flex-1 py-3 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl uppercase shadow-lg shadow-rose-200 active:scale-95 transition-all flex items-center justify-center gap-1 disabled:opacity-50">
                        {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircleIcon className="w-4 h-4"/>}
                        {loading ? 'Procesando...' : 'Cerrar Turno'}
                    </button>
                </div>
            </form>
        </ViewModal>
    );
};

export default CerrarTurnoModal;