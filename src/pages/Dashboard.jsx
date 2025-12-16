import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Auth } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../utils/MusicStorage';
import '../styles/dashboard.css';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        totalProducts: 0,
        totalStock: 0,
        avgPrice: 0,
        lowStockCount: 0,
        totalValue: 0,
        topFormat: ''
    });

    useEffect(() => {
        // Simulate fetching metrics from backend or calculate from existing endpoints
        const loadMetrics = async () => {
            try {
                const products = await getProducts();

                // Calculate metrics on the fly for now
                const totalProducts = products.length;
                const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
                const totalPrice = products.reduce((acc, p) => acc + (Number(p.precio) || 0), 0);
                const avgPrice = totalProducts > 0 ? (totalPrice / totalProducts).toFixed(0) : 0;
                const lowStockCount = products.filter(p => (Number(p.stock) || 0) < 5).length;
                const totalValue = products.reduce((acc, p) => acc + ((Number(p.precio) || 0) * (Number(p.stock) || 0)), 0);
                console.log(products)

                // Find top format and dist
                const formats = {};
                products.forEach(p => {
                    const fmt = p.formato || 'Desconocido';
                    formats[fmt] = (formats[fmt] || 0) + 1;
                });
                const topFormat = Object.entries(formats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

                setMetrics({
                    totalProducts,
                    totalStock,
                    avgPrice,
                    lowStockCount,
                    totalValue,
                    topFormat,
                    formats // passing full dist for graph
                });
            } catch (e) {
                console.error("Error loading metrics", e);
            } finally {
                setLoading(false);
            }
        };

        loadMetrics();

    }, []);



    const chartData = {
        labels: metrics.formats ? Object.keys(metrics.formats) : [],
        datasets: [
            {
                label: 'Cantidad de Productos',
                data: metrics.formats ? Object.values(metrics.formats) : [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Distribución por Formato',
            },
        },
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h1 className="mb-4 text-center mb-5">Dashboard de Negocio</h1>

            <Row className="g-4 mb-5">
                <Col md={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="display-4 text-primary mb-2">{metrics.totalProducts}</div>
                            <Card.Title>Total Productos</Card.Title>
                            <Card.Text>Productos únicos en catálogo</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="display-4 text-success mb-2">{metrics.totalStock}</div>
                            <Card.Title>Stock Total</Card.Title>
                            <Card.Text>Unidades físicas disponibles</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="display-4 text-info mb-2">${metrics.avgPrice.toLocaleString()}</div>
                            <Card.Title>Precio Promedio</Card.Title>
                            <Card.Text>Valor medio por unidad</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm bg-light">
                        <Card.Body className="text-center">
                            <div className="display-6 text-warning mb-2">{metrics.lowStockCount}</div>
                            <Card.Title>Stock Bajo</Card.Title>
                            <Card.Text>Productos con menos de 5 unidades</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm bg-light">
                        <Card.Body className="text-center">
                            <div className="display-6 text-info mb-2">${metrics.totalValue.toLocaleString()}</div>
                            <Card.Title>Valor Inventario</Card.Title>
                            <Card.Text>Valor total estimado (CLP)</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="h-100 shadow-sm bg-light">
                        <Card.Body className="text-center">
                            <div className="display-6 text-secondary mb-2">{metrics.topFormat}</div>
                            <Card.Title>Formato Top</Card.Title>
                            <Card.Text>Formato más común</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={8} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Body className="carta-grafico">
                            <Bar className="grafico" options={chartOptions} data={chartData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
