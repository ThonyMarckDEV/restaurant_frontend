import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/kardex`;

export const index = async (page = 1, filters = {}) => {
    // Armamos la URL con los parámetros de búsqueda
    const params = new URLSearchParams({
        page: page,
        insumo_id: filters.insumo_id || '',
        almacen_id: filters.almacen_id || '',
        tipo_movimiento: filters.tipo_movimiento || '',
        fecha_inicio: filters.fecha_inicio || '',
        fecha_fin: filters.fecha_fin || ''
    });

    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};