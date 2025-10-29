import dataProducto from '../data/DataProducto';

const STORAGE_KEY = 'music_products';

export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataProducto));
  }
};

/**
 * Obtiene todos los productos almacenados.
 * @returns {Array<Object>} Lista de productos.
 */
export const getProducts = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Persiste el listado completo de productos.
 * @param {Array<Object>} products - Productos a guardar.
 * @returns {void}
 */
export const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

/**
 * Agrega un nuevo producto y retorna el creado (con id).
 * @param {Object} product - Producto a agregar.
 * @returns {Object} Producto creado con id asignado.
 */
export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now().toString() };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

/**
 * Actualiza un producto por id con los campos provistos.
 * @param {string} id - Id del producto a actualizar.
 * @param {Object} updated - Campos a actualizar.
 * @returns {Array<Object>} Lista de productos actualizada.
 */
export const updateProduct = (id, updated) => {
  const products = getProducts().map((p) =>
    p.id === id ? { ...p, ...updated } : p
  );
  saveProducts(products);
  return products;
};

/**
 * Elimina un producto por id.
 * @param {string} id - Id del producto a eliminar.
 * @returns {Array<Object>} Lista de productos actualizada.
 */
export const deleteProduct = (id) => {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
  return products;
};
