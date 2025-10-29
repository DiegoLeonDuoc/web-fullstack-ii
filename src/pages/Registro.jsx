import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormularioRegistro from "../components/FormularioRegistro";
import "../styles/registro.css";

/**
 * Página de registro de usuarios.
 * @returns {JSX.Element}
 */
export default function Registro() {
  return (
    <Container className="registro-container">
      <Row className="formulario-registro">
        <Col xs={12} md={8} lg={6} className="registro-col">
          <Card className="text-white registro-card">
            <Card.Body>
              <h2 className="card-title">Formulario de registro</h2>
              <FormularioRegistro />
              <div className="cuenta-registrada">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-light">
                  Inicia sesión
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
