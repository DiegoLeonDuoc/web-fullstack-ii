import React from "react";
import exampleImg from "../images/ExampleCarouselImage.jpg";

/**
 * Imagen de ejemplo para carrusel.
 * @returns {JSX.Element}
 */
function ExampleCarouselImage() {
    return (
        <img
        src={exampleImg}
        alt="Imagen de ejemplo"
        style={{ maxHeight: "400px", objectFit: "cover" }}
        />
    );
}

export default ExampleCarouselImage;
