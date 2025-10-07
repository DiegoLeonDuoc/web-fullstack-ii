import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Form,
} from "react-bootstrap";

import dataProducto from "../data/DataProducto";   // ← now an array
import dataReviews from "../data/DataReviews";
import estrellas from "../components/Estrellas";
import "../styles/producto.css";

export default function ProductPage() {
  const { id } = useParams();                     
  const [product, setProduct] = useState(null);   
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const found = dataProducto.find((p) => p.id === id);
    console.log(found);
    setProduct(found || null);
    setReviews(dataReviews.filter((r) => r.productNom === id));
  }, [id]);

  if (!product) return <div>Loading…</div>;

  return (
    <Container className="container product-page">
      <Row>
        <Col className="gallery-column">
          <Card className="product-gallery">
            <Image id="main-image" src={product.img} alt="Portada del álbum" />
          </Card>
        </Col>

        <Col className="info-column">
          <div className="product‑info">
            <h2 className="product-title">{product.titulo}</h2>

            <div className="price-rating">
              <div>
                <span className="price-label">Precio:</span>{" "}
                <span className="price-value">{product.precio}</span>
              </div>

              <div className="rating">
                <div className="stars">{estrellas(product.rating)}</div>
                <div className="rating-count">
                  {product.rating} ({product.ratingCount} reseñas)
                </div>
              </div>
            </div>

            <p className="product-format">
              <strong>Formato:</strong> {product.formato}
            </p>
            <p className="product-desc">{product.descripcion}</p>

            <Form className="purchase-controls">
              <Form.Label htmlFor="qty">Cantidad</Form.Label>
              <Form.Control
                id="qty"
                type="number"
                min={1}
                defaultValue={1}
                className="qty-input"
              />
              <Button className="btn-primary">
                <i className="fa fa-shopping-cart" /> Agregar al carrito
              </Button>
              <Button className="btn-outline-light">
                <i className="fa fa-heart" /> Favorito
              </Button>
            </Form>

            <hr />

            <div className="product-meta">
              <div>
                <strong>Artista:</strong> {product.artista}
              </div>
              <div>
                <strong>Lanzamiento:</strong> {product.año}
              </div>
              <div>
                <strong>Etiqueta:</strong> {product.etiqueta}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <hr />

      <Row className="reviews-section">
        <Col>
          <h3>Reseñas y comentarios</h3>

          {reviews.map((rev) => (
            <Card key={rev.id} className="review">
              <div className="review-header">
                <div>
                  <strong>{rev.autor}</strong>
                  <div className="small text-muted">
                    {rev.rating} de 5 — {rev.fecha}
                  </div>
                </div>
                <div className="stars text-warning">{estrellas(rev.rating)}</div>
              </div>
              <p>{rev.texto}</p>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
