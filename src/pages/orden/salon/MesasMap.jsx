//pages/orden/salon
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { index as getMesas } from 'services/mesaService';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { MapIcon, UsersIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import jwtUtils from 'utilities/Token/jwtUtils';

const MesasMap = () => {
    const navigate = useNavigate();
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const token = jwtUtils.getAccessTokenFromCookie();
    const currentUserId = jwtUtils.getUserID(token);
    
    useEffect(() => {
        const fetchMesas = async () => {
            try {
                const response = await getMesas(1, { activo: 1 });
                setMesas(response.data || []);
            } catch (error) { 
                console.error(error); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchMesas();
    }, []);

    // CLICK EN UNA MESA (Salón)
    const handleMesaClick = (mesa) => {
        if (mesa.estado === 1) {
            // Es salón, le pasamos el ID en la URL
            navigate(`/orden/crear/${mesa.id}`, { state: { mesa_numero: mesa.numero } });
        } else if (mesa.estado === 2) {
            if (Number(mesa.mozo_id) !== Number(currentUserId)) {
                alert(`Esta mesa es de ${mesa.mozo_nombre}.`);
                return;
            }

            if (mesa.orden_activa_id) {
                navigate(`/orden/salon/${mesa.orden_activa_id}`);
            } else {
                alert('No hay orden activa aquí.');
            }
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 md:p-6 pb-24 lg:pb-6">
            <PageHeader title="Salón Principal" subtitle="Control por Mozo" icon={MapIcon} />
            
            <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200 mt-4 overflow-hidden">
                <div className="relative w-full aspect-[3/4] sm:aspect-square lg:aspect-[21/9] bg-slate-50 rounded-xl border-2 border-slate-300 overflow-hidden shadow-inner">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    {mesas.map(mesa => {
                        const isMyMesa = mesa.mozo_id === currentUserId;
                        const isOccupied = mesa.estado === 2;
                        
                        const bgColor = mesa.estado === 1 ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700' :
                                        isMyMesa ? 'bg-blue-500 hover:bg-blue-600 border-blue-700' : 
                                        isOccupied ? 'bg-red-500 hover:bg-red-600 border-red-700' : 
                                        'bg-amber-500 border-amber-700';

                        const posX = isMobile ? mesa.pos_y : mesa.pos_x;
                        const posY = isMobile ? mesa.pos_x : mesa.pos_y;

                        return (
                            <div 
                                key={mesa.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-500"
                                style={{ left: `${posX}%`, top: `${posY}%` }}
                            >
                                {isOccupied && (
                                    <span className={`text-[9px] lg:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 ${isMyMesa ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'} whitespace-nowrap`}>
                                        <UserIcon className="w-2.5 h-2.5 shrink-0" />
                                        <span className="truncate max-w-[50px] lg:max-w-none">{isMyMesa ? 'Mía' : mesa.mozo_nombre}</span>
                                    </span>
                                )}

                                <button 
                                    onClick={() => handleMesaClick(mesa)}
                                    className={`w-14 h-14 lg:w-16 lg:h-16 text-white rounded-xl border-b-4 flex flex-col items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 ${bgColor} z-10 cursor-pointer relative`}
                                >
                                    {isOccupied && !isMyMesa && (
                                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 border border-red-200">
                                            <LockClosedIcon className="w-3 h-3 text-red-500" />
                                        </div>
                                    )}
                                    <span className="text-[10px] lg:text-[11px] font-black truncate px-1 w-full text-center drop-shadow-md leading-tight">{mesa.numero}</span>
                                    <span className="text-[9px] flex items-center gap-0.5 opacity-90 font-bold mt-0.5">
                                        <UsersIcon className="w-3 h-3"/> {mesa.capacidad}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MesasMap;