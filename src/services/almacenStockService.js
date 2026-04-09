import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/almacen-stock`;

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
        page:       page,
        insumo_id:  filters.insumo_id  || '',
        almacen_id: filters.almacen_id || '',
        search:     filters.search     || '',
        con_stock_bajo: filters.con_stock_bajo || '',
    });

    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const updateStockMinimo = async (id, stockMinimo) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/updateStockMinimo`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_minimo: stockMinimo }),
    });
    return handleResponse(response);
};