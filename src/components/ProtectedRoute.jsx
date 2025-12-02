import { Navigate } from 'react-router-dom';
import { Auth } from '../utils/Auth';
import { useState, useEffect } from 'react';

/**
 * Componente que protege rutas requiriendo rol ADMIN
 */
function ProtectedRoute({ children }) {
    const { isLoggedIn, currentUser } = Auth();
    const [isChecking, setIsChecking] = useState(true);

    // Esperar a que Auth se inicialice
    useEffect(() => {
        // Pequeño delay para asegurar que Auth haya leído de localStorage
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Mostrar nada mientras se verifica
    if (isChecking) {
        return null;
    }

    // Verificar si el usuario está logueado y tiene rol ADMIN
    const isAdmin = isLoggedIn && currentUser?.roles?.includes('ROLE_ADMIN');

    if (!isAdmin) {
        // Redirigir a home si no es admin
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
