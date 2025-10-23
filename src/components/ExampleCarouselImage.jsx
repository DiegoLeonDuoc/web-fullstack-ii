import React from "react";
import exampleImg from "../images/ExampleCarouselImage.jpg";

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
