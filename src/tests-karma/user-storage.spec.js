import Storage from "../utils/UserStorage";

// Verificamos que la capa mock de usuarios siga respondiendo igual que cuando la usamos en la app.
describe("UserStorage (Jasmine)", () => {
  beforeEach(() => {
    localStorage.clear();
    Storage.initializeStorage();
  });

  it("inicializa usuarios mock", () => {
    const users = Storage.getUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  it("guarda un nuevo usuario", async () => {
    const res = await Storage.saveUser({
      rut: "22.333.444-5",
      age: "28",
      firstName: "Ana",
      lastName: "Torres",
      phone: "+56 9 5555 5555",
      email: "ana.torres@example.com",
      password: "Password123!",
    });
    expect(res.success).toBeTrue();
    expect(typeof res.user.id).toBe("number");
  });

  it("evita duplicar email o rut", async () => {
    const existing = Storage.getUsers()[0];

    await expectAsync(
      Storage.saveUser({ ...existing, email: existing.email })
    ).toBeResolvedTo(jasmine.objectContaining({ success: false }));

    await expectAsync(
      Storage.saveUser({ ...existing, rut: existing.rut })
    ).toBeResolvedTo(jasmine.objectContaining({ success: false }));
  });

  it("login y logout actualizan la sesion", () => {
    const user = Storage.getUsers()[0];
    const login = Storage.loginUser(user);
    expect(login.success).toBeTrue();
    expect(Storage.isUserLoggedIn()).toBeTrue();

    const logout = Storage.logoutUser();
    expect(logout.success).toBeTrue();
    expect(Storage.isUserLoggedIn()).toBeFalse();
  });

  it("obtiene estadisticas basicas", () => {
    const stats = Storage.getStats();
    expect(stats.totalUsers).toBeGreaterThan(0);
    expect(typeof stats.averageAge).toBe("number");
  });
});
