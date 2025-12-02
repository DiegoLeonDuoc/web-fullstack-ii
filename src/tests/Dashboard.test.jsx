/**
 * Dejamos un entorno fake del dashboard para asegurarnos que los flujos CRUD sigan vivos.
 * Mockeamos router, auth y storage porque en la vista real dependen de muchas piezas.
 */
import React from "react";
import { fireEvent, render, screen, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Dashboard from "../pages/Dashboard";

const navigateMock = vi.hoisted(() => vi.fn());
const productState = vi.hoisted(() => ({ items: [] }));

// Usamos un objeto mutable para imitar el estado del hook Auth en cada caso.
const authState = vi.hoisted(() => ({
  isLoggedIn: true,
  currentUser: { firstName: "Admin", lastName: "User" },
  login: vi.fn(),
  logout: vi.fn(),
  checkAuthStatus: vi.fn(),
}));

const musicStorageMock = vi.hoisted(() => ({
  initStorage: vi.fn(),
  getProducts: vi.fn(async () => productState.items),
  addProduct: vi.fn(async (prod) => {
    const newProd = { id: prod.id || `${productState.items.length + 1}`, ...prod };
    productState.items = [...productState.items, newProd];
    return newProd;
  }),
  updateProduct: vi.fn(async (id, updated) => {
    productState.items = productState.items.map((p) =>
      p.id === id ? { ...p, ...updated } : p
    );
    return productState.items;
  }),
  deleteProduct: vi.fn(async (id) => {
    productState.items = productState.items.filter((p) => p.id !== id);
    return productState.items;
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  // Dejamos todo igual y solo cambiamos useNavigate para observar redirecciones.
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../utils/Auth", () => ({
  Auth: () => authState,
}));

vi.mock("../utils/MusicStorage", () => musicStorageMock);

vi.mock("../components/ProductForm", () => ({
  // Formulario sintetico: dispara onSubmit con datos listos.
  default: ({ onSubmit, selectedProduct, onCancel }) => (
    <div data-testid="product-form">
      <button
        type="button"
        data-testid="submit-form"
        onClick={() =>
          onSubmit({
            titulo: "Nuevo producto",
            artista: "Nuevo artista",
            formato: "CD",
            anio: "2024",
            etiqueta: "Mock Label",
            precio: "$10.000",
            descripcion: "Descripcion mock",
            img: "/img/mock.png",
          })
        }
      >
        enviar
      </button>
      {selectedProduct && (
        <>
          <span data-testid="editing-flag">{selectedProduct.titulo}</span>
          <button
            type="button"
            data-testid="submit-update"
            onClick={() =>
              onSubmit({
                titulo: "Producto actualizado",
                artista: "Artista actualizado",
                formato: "Vinilo",
                anio: "1999",
                etiqueta: "Mock Label",
                precio: "$12.000",
                descripcion: "Descripcion actualizada",
                img: "/img/mock.png",
              })
            }
          >
            actualizar
          </button>
          <button type="button" data-testid="cancel-edit" onClick={onCancel}>
            cancelar
          </button>
        </>
      )}
    </div>
  ),
}));

vi.mock("../components/ProductTable", () => ({
  // Tabla fake para disparar onEdit y onDelete sin render pesado.
  default: ({ products, onEdit, onDelete }) => (
    <div data-testid="product-table">
      {products.map((p) => (
        <div key={p.id} data-testid={`product-${p.id}`}>
          <span>{p.titulo}</span>
          <button type="button" data-testid={`edit-${p.id}`} onClick={() => onEdit(p)}>
            editar
          </button>
          <button type="button" data-testid={`delete-${p.id}`} onClick={() => onDelete(p.id)}>
            eliminar
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../components/ArtistaForm", () => ({
  default: () => <div data-testid="artista-form" />,
}));

vi.mock("../components/ArtistaTable", () => ({
  default: () => <div data-testid="artista-table" />,
}));

vi.mock("../components/SelloForm", () => ({
  default: () => <div data-testid="sello-form" />,
}));

vi.mock("../components/SelloTable", () => ({
  default: () => <div data-testid="sello-table" />,
}));

vi.mock("react-bootstrap", () => ({
  // Componentes de layout reducidos a divs para trabajar sin dependencias extra.
  Container: ({ children, fluid, ...props }) => (
    <div data-testid="rb-container" {...props}>
      {children}
    </div>
  ),
  Row: ({ children, ...props }) => (
    <div data-testid="rb-row" {...props}>
      {children}
    </div>
  ),
  Col: ({ children, ...props }) => (
    <div data-testid="rb-col" {...props}>
      {children}
    </div>
  ),
  Tabs: ({ children, activeKey, onSelect, ...props }) => (
    <div data-testid="rb-tabs" {...props}>
      {children}
    </div>
  ),
  Tab: ({ children, eventKey, title }) => (
    <div data-testid={`rb-tab-${eventKey || 'default'}`} data-title={title}>
      {children}
    </div>
  ),
  Spinner: () => <div data-testid="spinner">cargando...</div>,
}));

describe("Dashboard", () => {
  let confirmSpy;
  let fetchSpy;
  beforeEach(() => {
    navigateMock.mockReset();
    productState.items = [];
    musicStorageMock.initStorage.mockClear();
    musicStorageMock.getProducts.mockReset();
    musicStorageMock.addProduct.mockReset();
    musicStorageMock.updateProduct.mockReset();
    musicStorageMock.deleteProduct.mockReset();
    musicStorageMock.getProducts.mockImplementation(async () => productState.items);
    musicStorageMock.addProduct.mockImplementation(async (prod) => {
      const newProd = { id: prod.id || `${productState.items.length + 1}`, ...prod };
      productState.items = [...productState.items, newProd];
      return newProd;
    });
    musicStorageMock.updateProduct.mockImplementation(async (id, updated) => {
      productState.items = productState.items.map((p) =>
        p.id === id ? { ...p, ...updated } : p
      );
      return productState.items;
    });
    musicStorageMock.deleteProduct.mockImplementation(async (id) => {
      productState.items = productState.items.filter((p) => p.id !== id);
      return productState.items;
    });
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ _embedded: { artistaList: [], selloList: [] } }),
    });
    authState.isLoggedIn = true;
  });

  afterEach(() => {
    cleanup();
    confirmSpy.mockRestore();
    fetchSpy.mockRestore();
  });

  it("muestra un spinner mientras la autenticacion se esta verificando", () => {
    musicStorageMock.getProducts.mockReturnValue([]);
    render(<Dashboard />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it("redirige al inicio cuando el usuario no esta autenticado", async () => {
    authState.isLoggedIn = false;
    musicStorageMock.getProducts.mockReturnValue([]);

    render(<Dashboard />);
    await waitFor(() => expect(navigateMock).toHaveBeenCalled());

    // Si el usuario no es admin, debe abortar sin tocar storage.
    expect(navigateMock).toHaveBeenCalledWith('/');
    expect(musicStorageMock.initStorage).not.toHaveBeenCalled();
  });

  it("inicializa storage y muestra productos cuando la sesion es valida", async () => {
    productState.items = [{ id: '1', titulo: 'Disco 1' }];

    render(<Dashboard />);
    await waitFor(() => expect(musicStorageMock.getProducts).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('Disco 1')).toBeInTheDocument());
  });

  it("agrega un producto nuevo mediante el formulario", async () => {
    productState.items = [{ id: '1', titulo: 'Disco 1' }];

    render(<Dashboard />);
    await waitFor(() => expect(musicStorageMock.getProducts).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('Disco 1')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('submit-form'));

    expect(musicStorageMock.addProduct).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: 'Nuevo producto' })
    );
    await waitFor(() => expect(screen.getByText('Nuevo producto')).toBeInTheDocument());
  });

  it("actualiza un producto existente cuando se edita", async () => {
    productState.items = [{ id: '1', titulo: 'Disco 1' }];

    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Disco 1')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('edit-1'));
    expect(screen.getByTestId('editing-flag')).toHaveTextContent('Disco 1');

    // El stub envia el payload actualizado y se debe limpiar la seleccion.
    fireEvent.click(screen.getByTestId('submit-update'));

    expect(musicStorageMock.updateProduct).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ titulo: 'Producto actualizado' })
    );
    await waitFor(() => expect(screen.queryByTestId('editing-flag')).not.toBeInTheDocument());
  });

  it("elimina un producto correctamente", async () => {
    productState.items = [{ id: '1', titulo: 'Disco 1' }];

    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Disco 1')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('delete-1'));

    // Garantiza que se use el id correcto y se refleje la tabla sin elementos.
    expect(musicStorageMock.deleteProduct).toHaveBeenCalledWith('1');
    await waitFor(() => expect(screen.queryByText('Disco 1')).not.toBeInTheDocument());
  });
});
