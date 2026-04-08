import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/orden`;

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams();
    
    // Agregamos manualmente para asegurar que no se escape nada
    params.append('page', page);
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.tipo_pedido) params.append('tipo_pedido', filters.tipo_pedido);
    if (filters.mesa_id) params.append('mesa_id', filters.mesa_id);
    if (filters.fecha) params.append('fecha', filters.fecha);
    if (filters.search) params.append('search', filters.search);
    if (filters.forCaja) params.append('forCaja', filters.forCaja); 

    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const show = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
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

export const update = async (id, data) => {
    const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const updateStatus = async (id, estado) => {
    const response = await fetchWithAuth(`${BASE_URL}/status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
    });
    return handleResponse(response);
};

export const destroy = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
    return handleResponse(response);
};