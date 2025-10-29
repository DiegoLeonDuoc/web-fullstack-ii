import dataProducto from '../data/DataProducto';

const STORAGE_KEY = 'music_products';

export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataProducto));
  }
};

export const getProducts = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now().toString() };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id, updated) => {
  const products = getProducts().map((p) =>
    p.id === id ? { ...p, ...updated } : p
  );
  saveProducts(products);
  return products;
};

export const deleteProduct = (id) => {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
  return products;
};
