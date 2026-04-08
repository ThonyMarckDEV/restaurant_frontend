import React, { useState } from 'react';
import { MapIcon, UsersIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const MesaForm = ({ form, setForm, handleChange, existingMesas = [] }) => {
    
    const [collisionError, setCollisionError] = useState('');

    const handleCanvasClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Calculamos porcentaje X y Y
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Evitamos que se salga de los bordes del mapa
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));

        // LÓGICA DE COLISIÓN: Distancia mínima de 8% entre mesas
        const MIN_DISTANCE = 8; 
        
        const isCollision = existingMesas.some(mesa => {
            const distance = Math.sqrt(Math.pow(x - parseFloat(mesa.pos_x), 2) + Math.pow(y - parseFloat(mesa.pos_y), 2));
            return distance < MIN_DISTANCE;
        });

        if (isCollision) {
            setCollisionError('¡La mesa debe estar separada de las demás! Busca otro hueco.');
            return;
        }

        // Si no hay colisión, actualizamos coordenadas y limpiamos error
        setCollisionError('');
        handleChange('pos_x', x);
        handleChange('pos_y', y);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <MapIcon className="w-5 h-5" /> Configuración y Ubicación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Datos Básicos */}
                <div className="md:col-span-4 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre / Número <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={form.numero || ''}
                            onChange={(e) => handleChange('numero', e.target.value)}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Ej: Mesa 01, VIP-A..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Capacidad (Sillas) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <UsersIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400"/>
                            <input
                                type="number"
                                min="1"
                                value={form.capacidad || ''}
                                onChange={(e) => handleChange('capacidad', e.target.value)}
                                className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                                placeholder="Ej: 4"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Plano Visual (Canvas) */}
                <div className="md:col-span-8 relative">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex justify-between">
                        <span>Ubicación en Salón</span>
                        <span className="text-slate-400 font-normal normal-case">Haz clic para ubicar</span>
                    </label>
                    
                    {collisionError && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg z-10 animate-bounce">
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            {collisionError}
                        </div>
                    )}

                    <div 
                        className="relative w-full aspect-[21/9] bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 cursor-crosshair overflow-hidden shadow-inner transition-colors hover:border-slate-400"
                        onClick={handleCanvasClick}
                    >
                        {/* Grilla decorativa */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        
                        {/* Renderizar las Mesas Existentes (Fantasmas) */}
                        {existingMesas.map(mesa => (
                            <div 
                                key={mesa.id}
                                className="absolute w-12 h-12 bg-slate-300 border-2 border-slate-400 text-slate-500 rounded-lg flex flex-col items-center justify-center shadow-sm transform -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"
                                style={{ left: `${mesa.pos_x}%`, top: `${mesa.pos_y}%` }}
                            >
                                <span className="text-[9px] font-bold truncate px-1 w-full text-center">
                                    {mesa.numero}
                                </span>
                            </div>
                        ))}

                        {/* La Mesa Activa (La que estamos moviendo) */}
                        <div 
                            className="absolute w-14 h-14 bg-black text-white rounded-lg flex flex-col items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-10"
                            style={{ 
                                left: `${form.pos_x || 50}%`, 
                                top: `${form.pos_y || 50}%` 
                            }}
                        >
                            <span className="text-[10px] font-black truncate w-full text-center px-1">
                                {form.numero || 'NUEVA'}
                            </span>
                            <span className="text-[8px] text-gray-300 flex items-center gap-0.5">
                                <UsersIcon className="w-2 h-2"/> {form.capacidad || 0}
                            </span>
                        </div>

                    </div>
                    <div className="flex gap-4 mt-2 text-[10px] font-mono text-slate-400 justify-end">
                        <span>X: {Number(form.pos_x).toFixed(1)}%</span>
                        <span>Y: {Number(form.pos_y).toFixed(1)}%</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MesaForm;