/**
 * Dejamos un entorno fake del dashboard para asegurarnos que los flujos CRUD sigan vivos.
 * Mockeamos router, auth y storage porque en la vista real dependen de muchas piezas.
 */
import React from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import Dashboard from "../pages/Dashboard";

const navigateMock = vi.hoisted(() => vi.fn());

// Usamos un objeto mutable para imitar el estado del hook Auth en cada caso.
const authState = vi.hoisted(() => ({
  isLoggedIn: true,
  currentUser: { firstName: "Admin", lastName: "User" },
  login: vi.fn(),
  logout: vi.fn(),
  checkAuthStatus: vi.fn(),
}));

const musicStorageMock = vi.hoisted(() => ({
  // El componente llama a todas, asi que es mas simple stubearlas aca.
  initStorage: vi.fn(),
  getProducts: vi.fn(),
  addProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
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

vi.mock("react-bootstrap", () => ({
  // Componentes de layout reducidos a divs para trabajar sin dependencias extra.
  Container: ({ children, ...props }) => (
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
  Spinner: () => <div data-testid="spinner">cargando...</div>,
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigateMock.mockReset();
    musicStorageMock.initStorage.mockReset();
    musicStorageMock.getProducts.mockReset();
    musicStorageMock.addProduct.mockReset();
    musicStorageMock.updateProduct.mockReset();
    musicStorageMock.deleteProduct.mockReset();
    authState.isLoggedIn = true;
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  const flushTimers = async () => {
    // El componente espera 50 ms para sincronizar Auth; aqui lo simulamos.
    await act(async () => {
      vi.runAllTimers();
    });
  };

  it("muestra un spinner mientras la autenticacion se esta verificando", () => {
    musicStorageMock.getProducts.mockReturnValue([]);
    render(<Dashboard />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it("redirige al inicio cuando el usuario no esta autenticado", async () => {
    authState.isLoggedIn = false;
    musicStorageMock.getProducts.mockReturnValue([]);

    render(<Dashboard />);
    await flushTimers();

    // Si el usuario no es admin, debe abortar sin tocar storage.
    expect(navigateMock).toHaveBeenCalledWith('/');
    expect(musicStorageMock.initStorage).not.toHaveBeenCalled();
  });

  it("inicializa storage y muestra productos cuando la sesion es valida", async () => {
    const productos = [{ id: '1', titulo: 'Disco 1' }];
    musicStorageMock.getProducts.mockReturnValue(productos);

    render(<Dashboard />);
    await flushTimers();

    // Validamos que el efecto secuencial se ejecute en el orden esperado.
    expect(musicStorageMock.initStorage).toHaveBeenCalledTimes(1);
    expect(musicStorageMock.getProducts).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Disco 1')).toBeInTheDocument();
  });

  it("agrega un producto nuevo mediante el formulario", async () => {
    const productos = [{ id: '1', titulo: 'Disco 1' }];
    musicStorageMock.getProducts.mockReturnValue(productos);
    const nuevoProducto = { id: '2', titulo: 'Nuevo producto' };
    musicStorageMock.addProduct.mockReturnValue(nuevoProducto);

    render(<Dashboard />);
    await flushTimers();
    expect(screen.getByText('Disco 1')).toBeInTheDocument();

    // El boton del stub simula un submit exitoso del formulario completo.
    fireEvent.click(screen.getByTestId('submit-form'));

    expect(musicStorageMock.addProduct).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: 'Nuevo producto' })
    );
    expect(screen.getByText('Nuevo producto')).toBeInTheDocument();
  });

  it("actualiza un producto existente cuando se edita", async () => {
    const productos = [{ id: '1', titulo: 'Disco 1' }];
    musicStorageMock.getProducts.mockReturnValue(productos);
    musicStorageMock.updateProduct.mockReturnValue([{ id: '1', titulo: 'Producto actualizado' }]);

    render(<Dashboard />);
    await flushTimers();

    fireEvent.click(screen.getByTestId('edit-1'));
    expect(screen.getByTestId('editing-flag')).toHaveTextContent('Disco 1');

    // El stub envia el payload actualizado y se debe limpiar la seleccion.
    fireEvent.click(screen.getByTestId('submit-update'));

    expect(musicStorageMock.updateProduct).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ titulo: 'Producto actualizado' })
    );
    expect(screen.queryByTestId('editing-flag')).not.toBeInTheDocument();
    await flushTimers();
  });

  it("elimina un producto correctamente", async () => {
    const productos = [{ id: '1', titulo: 'Disco 1' }];
    musicStorageMock.getProducts.mockReturnValue(productos);
    musicStorageMock.deleteProduct.mockReturnValue([]);

    render(<Dashboard />);
    await flushTimers();
    expect(screen.getByText('Disco 1')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('delete-1'));

    // Garantiza que se use el id correcto y se refleje la tabla sin elementos.
    expect(musicStorageMock.deleteProduct).toHaveBeenCalledWith('1');
    expect(screen.queryByText('Disco 1')).not.toBeInTheDocument();
  });
});
