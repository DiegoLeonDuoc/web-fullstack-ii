describe("index.jsx DOM bootstrap (Jasmine)", () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  // Checamos que el entrypoint siga montando React sobre el div root como siempre.
  it("monta la aplicacion en el elemento root", async () => {
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    const ReactDOMClient = await import('react-dom/client');
    const defaultClient = ReactDOMClient.default ?? ReactDOMClient;
    const renderSpy = jasmine.createSpy('render');
    const originalNamedCreateRoot = ReactDOMClient.createRoot;
    const originalDefaultCreateRoot = defaultClient.createRoot;
    const createRootSpy = jasmine.createSpy('createRoot').and.returnValue({ render: renderSpy });
    ReactDOMClient.createRoot = createRootSpy;
    defaultClient.createRoot = createRootSpy;

    await import('../index.jsx?karma');

    expect(createRootSpy).toHaveBeenCalledWith(rootElement);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    ReactDOMClient.createRoot = originalNamedCreateRoot;
    defaultClient.createRoot = originalDefaultCreateRoot;
  });
});
