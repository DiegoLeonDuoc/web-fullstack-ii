import React, { useState, useEffect } from 'react';

/**
 * Componente que consume una API externa (mindicador.cl)
 * para mostrar indicadores económicos (UF, Dólar).
 */
export default function EconomicIndicators() {
    const [indicators, setIndicators] = useState({ uf: null, dolar: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIndicators = async () => {
            try {
                const res = await fetch('https://mindicador.cl/api');
                if (!res.ok) throw new Error('Error fetching indicators');
                const data = await res.json();
                setIndicators({
                    uf: data.uf,
                    dolar: data.dolar
                });
            } catch (err) {
                console.error('Error fetching economic indicators:', err);
                setError('No disponible');
            } finally {
                setLoading(false);
            }
        };

        fetchIndicators();
    }, []);

    if (loading) return <span className="text-muted small">Cargando indicadores...</span>;
    if (error) return <span className="text-muted small">Indicadores: {error}</span>;

    return (
        <div className="economic-indicators mt-3 pt-3 border-top border-secondary">
            <h6 className="text-uppercase text-muted small mb-2">Indicadores Económicos</h6>
            <div className="d-flex gap-3 text-white-50 small">
                {indicators.uf && (
                    <div>
                        <strong>UF:</strong> ${indicators.uf.valor.toLocaleString('es-CL')}
                    </div>
                )}
                {indicators.dolar && (
                    <div>
                        <strong>Dólar:</strong> ${indicators.dolar.valor.toLocaleString('es-CL')}
                    </div>
                )}
            </div>
            <div className="text-muted" style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                Fuente: mindicador.cl
            </div>
        </div>
    );
}
