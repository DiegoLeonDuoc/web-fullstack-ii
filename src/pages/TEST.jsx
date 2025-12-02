import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Pacientes() {
    const [pacientes, setPacientes] = useState([])
    const [estado, setEstado] = useState({ loading: false, error: null })

    useEffect(() => {
        const cargarPacientes = async () => {
            setEstado({ loading: true, error: null })
            try {
                const res = await fetch('/api/v1/productos')
                const text = await res.text()
                console.log(text)
                if (!res.ok) throw new Error(`Error ${res.status}: ${text}`)

                    const data = text ? JSON.parse(text) : []
                    console.log(data)
                    const lista = Array.isArray(data) ? data : data._embedded.productoList || []
                    setPacientes(lista)
                    console.log(lista)
            } catch (err) {
                setEstado({ loading: false, error: err.message })
                return
            }
            setEstado({ loading: false, error: null })
        }

        cargarPacientes()
    }, [])

    const formatDate = (iso) => {
        const d = new Date(iso)
        return isNaN(d) ? '' : d.toLocaleDateString()
    }

    if (estado.loading) return <div>Cargando pacientes...</div>
        if (estado.error) return <div style={{ color: 'crimson' }}>Error: {estado.error}</div>
            if (!pacientes.length) return <div>No hay pacientes para mostrar.</div>

                const columnas = [
                    { key: 'id', label: 'ID' },
                    { key: 'rut', label: 'RUN' },
                    { key: 'nombres', label: 'Nombres' },
                    { key: 'apellidos', label: 'Apellidos' },
                    { key: 'fechaNacimiento', label: 'Fecha Nacimiento', render: formatDate },
                    { key: 'correo', label: 'Correo' },
                    { key: 'atenciones', label: 'Atenciones', render: (v) => (Array.isArray(v) ? v.length : v || 0) }
                ]

                return (
                    <main style={{ padding: '1rem', marginTop: '80px' }}>
                    <h1>Listado de Pacientes</h1>
                    <div style={{ overflowX: 'auto', marginTop: 18 }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                    <tr>
                    {columnas.map(c => (
                        <th key={c.key} style={{ textAlign: 'left', padding: 8, borderBottom: '2px solid #ddd' }}>
                        {c.label}
                        </th>
                    ))}
                    </tr>
                    </thead>
                    <tbody>
                    {pacientes.map(p => (
                        <tr key={p.id} style={{ background: p.id % 2 ? '#fbfbfb' : 'transparent' }}>
                        {columnas.map(c => (
                            <td key={c.key} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                            {c.render ? c.render(p[c.key]) : p[c.key]}
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                    </table>
                    </div>
                    <Link to="/formulario">
                    <button>Ir al Formulario</button>
                    </Link>
                    </main>
                )
}
