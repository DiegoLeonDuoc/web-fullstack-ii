// SelloStorage.js — Utilidades para gestión de sellos discográficos

import Storage from './UserStorage';

// URL base para las peticiones relacionadas con sellos
const API_URL = '/api/v1/sellos';

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
 * Obtiene la lista de todos los sellos discográficos desde el backend.
 * 
 * Requiere autenticación (token JWT).
 * 
 * @returns {Promise<Array<Object>>} Lista de sellos del sistema
 *                                    Retorna array vacío si hay error
 * 
 * Estructura de cada sello:
 * {
 *   id: number,
 *   nombreSello: string,
 *   paisOrigen: string
 * }
 * 
 * Uso:
 * const sellos = await getSellos();
 * sellos.forEach(s => console.log(s.nombreSello));
 */
export const getSellos = async () => {
    try {
        const res = await fetch(API_URL, {
            headers: getAuthHeaders()
        });

        if (!res.ok) {
            throw new Error('Error al obtener sellos');
        }

        const data = await res.json();
        // Manejar respuesta HATEOAS
        return data._embedded?.selloList || data;
    } catch (error) {
        console.error('Error loading sellos:', error);
        return [];
    }
};

/**
 * Agrega un nuevo sello discográfico al sistema.
 * 
 * Requiere autenticación con rol ADMIN.
 * 
 * @param {Object} selloData - Datos del sello a crear
 * @param {string} selloData.nombreSello - Nombre del sello discográfico
 * @param {string} selloData.paisOrigen - País de origen
 * 
 * @returns {Promise<Object>} Sello creado con su ID asignado
 * 
 * @throws {Error} Si hay error en la petición o respuesta no válida
 * 
 * Uso:
 * const nuevoSello = await addSello({
 *   nombreSello: 'Capitol Records',
 *   paisOrigen: 'Estados Unidos'
 * });
 */
export const addSello = async (selloData) => {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(selloData)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al agregar sello');
        }

        return await res.json();
    } catch (error) {
        console.error('Error adding sello:', error);
        throw error;
    }
};

/**
 * Actualiza un sello discográfico existente.
 * 
 * Requiere autenticación con rol ADMIN.
 * 
 * @param {number} id - ID del sello a actualizar
 * @param {Object} selloData - Datos actualizados del sello
 * @param {string} selloData.nombreSello - Nombre del sello
 * @param {string} selloData.paisOrigen - País de origen
 * 
 * @returns {Promise<Object>} Sello actualizado
 * 
 * @throws {Error} Si hay error en la petición o sello no existe
 * 
 * Uso:
 * await updateSello(5, {
 *   nombreSello: 'Capitol Records Inc.',
 *   paisOrigen: 'USA'
 * });
 */
export const updateSello = async (id, selloData) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(selloData)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al actualizar sello');
        }

        return await res.json();
    } catch (error) {
        console.error('Error updating sello:', error);
        throw error;
    }
};

/**
 * Elimina un sello discográfico del sistema.
 * 
 * Requiere autenticación con rol ADMIN.
 * Advertencia: Si el sello tiene productos asociados, la eliminación puede fallar.
 * 
 * @param {number} id - ID del sello a eliminar
 * 
 * @returns {Promise<void>}
 * 
 * @throws {Error} Si hay error en la petición o sello tiene productos asociados
 * 
 * Uso:
 * try {
 *   await deleteSello(5);
 *   alert('Sello eliminado');
 * } catch (error) {
 *   alert('No se puede eliminar: tiene productos asociados');
 * }
 */
export const deleteSello = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!res.ok) {
            throw new Error('Error al eliminar sello');
        }
    } catch (error) {
        console.error('Error deleting sello:', error);
        throw error;
    }
};

/**
 * Objeto de exportación por defecto que agrupa todas las funciones.
 * 
 * Permite importar como: import SelloStorage from './SelloStorage'
 * Y usar: SelloStorage.getSellos(), SelloStorage.addSello(), etc.
 */
const SelloStorage = {
    getSellos,
    addSello,
    updateSello,
    deleteSello
};

export default SelloStorage;
