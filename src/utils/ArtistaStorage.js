// ArtistaStorage.js — Utilidades para gestión de artistas

import Storage from './UserStorage';

// URL base para las peticiones relacionadas con artistas
const API_URL = '/api/v1/artistas';

/**
 * Obtiene las cabeceras de autenticación con el token JWT.
 * 
 * Lee el token del usuario actual y lo formatea para peticiones HTTP.
 * 
 * @returns {Object} Objeto con cabeceras incluyendo Authorization
 */
const getAuthHeaders = () => {
    const user = Storage.getCurrentUser();
    const headers = {
        'Content-Type': 'application/json'
    };

    if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
    }

    return headers;
};

/**
 * Obtiene la lista de todos los artistas desde el backend.
 * 
 * Requiere autenticación (token JWT).
 * 
 * @returns {Promise<Array<Object>>} Lista de artistas del sistema
 *                                    Retorna array vacío si hay error
 * 
 * Estructura de cada artista:
 * {
 *   id: number,
 *   nombreArtista: string,
 *   paisOrigen: string
 * }
 * 
 * Uso:
 * const artistas = await getArtistas();
 * artistas.forEach(a => console.log(a.nombreArtista));
 */
export const getArtistas = async () => {
    try {
        const res = await fetch(API_URL, {
            headers: getAuthHeaders()
        });

        if (!res.ok) {
            throw new Error('Error al obtener artistas');
        }

        const data = await res.json();
        // Manejar respuesta HATEOAS
        return data._embedded?.artistaList || data;
    } catch (error) {
        console.error('Error loading artistas:', error);
        return [];
    }
};

/**
 * Agrega un nuevo artista al sistema.
 * 
 * Requiere autenticación con rol ADMIN.
 * 
 * @param {Object} artistaData - Datos del artista a crear
 * @param {string} artistaData.nombreArtista - Nombre del artista
 * @param {string} artistaData.paisOrigen - País de origen
 * 
 * @returns {Promise<Object>} Artista creado con su ID asignado
 * 
 * @throws {Error} Si hay error en la petición o respuesta no válida
 * 
 * Uso:
 * const nuevoArtista = await addArtista({
 *   nombreArtista: 'The Beatles',
 *   paisOrigen: 'Reino Unido'
 * });
 */
export const addArtista = async (artistaData) => {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(artistaData)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al agregar artista');
        }

        return await res.json();
    } catch (error) {
        console.error('Error adding artista:', error);
        throw error;
    }
};

/**
 * Actualiza un artista existente.
 * 
 * Requiere autenticación con rol ADMIN.
 * 
 * @param {number} id - ID del artista a actualizar
 * @param {Object} artistaData - Datos actualizados del artista
 * @param {string} artistaData.nombreArtista - Nombre del artista
 * @param {string} artistaData.paisOrigen - País de origen
 * 
 * @returns {Promise<Object>} Artista actualizado
 * 
 * @throws {Error} Si hay error en la petición o artista no existe
 * 
 * Uso:
 * await updateArtista(5, {
 *   nombreArtista: 'The Beatles',
 *   paisOrigen: 'UK'
 * });
 */
export const updateArtista = async (id, artistaData) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(artistaData)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al actualizar artista');
        }

        return await res.json();
    } catch (error) {
        console.error('Error updating artista:', error);
        throw error;
    }
};

/**
 * Elimina un artista del sistema.
 * 
 * Requiere autenticación con rol ADMIN.
 * Advertencia: Si el artista tiene productos asociados, la eliminación puede fallar.
 * 
 * @param {number} id - ID del artista a eliminar
 * 
 * @returns {Promise<void>}
 * 
 * @throws {Error} Si hay error en la petición o artista tiene productos asociados
 * 
 * Uso:
 * try {
 *   await deleteArtista(5);
 *   alert('Artista eliminado');
 * } catch (error) {
 *   alert('No se puede eliminar: tiene productos asociados');
 * }
 */
export const deleteArtista = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!res.ok) {
            throw new Error('Error al eliminar artista');
        }
    } catch (error) {
        console.error('Error deleting artista:', error);
        throw error;
    }
};

/**
 * Objeto de exportación por defecto que agrupa todas las funciones.
 * 
 * Permite importar como: import ArtistaStorage from './ArtistaStorage'
 * Y usar: ArtistaStorage.getArtistas(), ArtistaStorage.addArtista(), etc.
 */
const ArtistaStorage = {
    getArtistas,
    addArtista,
    updateArtista,
    deleteArtista
};

export default ArtistaStorage;
