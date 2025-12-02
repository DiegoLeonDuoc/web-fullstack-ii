import React from 'react';
import { describe, it, afterEach, expect, vi } from 'vitest';

const renderSpy = vi.fn();
const createRootSpy = vi.fn(() => ({ render: renderSpy }));

vi.mock('react-dom/client', async () => {
  const actual = await vi.importActual('react-dom/client');
  return {
    ...actual,
    createRoot: createRootSpy,
    default: { ...actual, createRoot: createRootSpy },
  };
});

vi.mock('../App', () => ({
  __esModule: true,
  default: () => <div data-testid="app-root" />,
}));

describe('index.jsx DOM bootstrap (Vitest)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
    vi.resetModules();
  });

  // Checamos que el entrypoint siga montando React sobre el div root como siempre.
  it('monta la aplicacion en el elemento root', async () => {
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    await import('../index.jsx');

    expect(createRootSpy).toHaveBeenCalledWith(rootElement);
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
