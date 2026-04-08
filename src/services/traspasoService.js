import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/traspaso`;

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
        page: page,
        search: filters.search || '',
        almacen_origen_id: filters.almacen_origen_id || '',
        almacen_destino_id: filters.almacen_destino_id || '',
        estado: filters.estado !== undefined ? filters.estado : ''
    });
    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const store = async (data) => {
    const response = await fetchWithAuth(`${BASE_URL}/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const show = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
    return handleResponse(response);
};

export const destroy = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
    return handleResponse(response);
};

export const downloadPdf = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/pdf/${id}`, { method: 'GET' });
    if (!response.ok) throw new Error('Error al generar el PDF');
    return await response.blob();
};