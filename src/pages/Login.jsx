// Login.js (Alternative version)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '../utils/Auth';
import { isValidEmail, isValidPassword } from '../utils/Utilidades';
import Storage from '../utils/UserStorage';
import '../styles/login.css'

/**
 * Página de inicio de sesión con validaciones básicas.
 * @returns {JSX.Element}
 */
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = Auth();
  const navigate = useNavigate();

  // Maneja cambios campo a campo y limpia el error específico al escribir
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validación mínima en cliente antes de intentar autenticarse
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'El formato del correo electrónico es inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envío del formulario: llama a la API de backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar usuario con token y RUT
        login({
          email: formData.email,
          username: data.email, // Assuming backend returns email as username or we use email for username
          roles: data.roles,
          token: data.token,
          rut: data.rut // Extract and store rut
        });
        navigate('/'); // Navigate to home page
      } else {
        setErrors({
          submit: 'Credenciales inválidas. Por favor, intenta de nuevo.'
        });
      }
    } catch (error) {
      console.error(error);
      setErrors({
        submit: 'Error al iniciar sesión. Por favor, intenta de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">

      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Iniciar sesión</h2>

                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    {errors.submit}
                  </div>
                )}

                <form id="loginForm" onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label className="label-input" htmlFor="email">Correo electrónico</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@correo.com"
                      required
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="label-input" htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="●●●●●●●●"
                      required
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <div className='text-center'>
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Iniciando sesión...' : 'Entrar'}
                    </button>
                  </div>
                </form>

                <div className="mt-3 text-center small">
                  ¿No tienes cuenta?{' '}
                  <Link to="/registro" className="text-light">
                    Regístrate
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Login;