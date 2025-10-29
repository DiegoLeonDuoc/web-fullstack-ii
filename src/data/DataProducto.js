const viniloImg = "/images/Vinilo.png";
const cdImg = "/images/CD.png";
// Mock data for the 10 album recommendations
const dataProducto = [
  {
    id: "abbey-road-vinilo",
    img: viniloImg,
    titulo: "Abbey Road — The Beatles",
    precio: "$18.990",
    formato: "Vinilo 12\" (180g) — Edición limitada",
    artista: "The Beatles",
    año: "1969",
    etiqueta: "Beat Bazaar Records",
    descripcion:
      "Reedición remasterizada del álbum clásico, con funda gatefold y libreto de 12 páginas.",
    rating: 4.5,
    ratingCount: 128,
  },
  {
    id: "thriller-cd",
    img: cdImg,
    titulo: "Thriller — Michael Jackson",
    precio: "$18.990",
    formato: "CD — Edición especial",
    artista: "Michael Jackson",
    año: "1982",
    etiqueta: "Moonwalk Music",
    descripcion:
      "Versión remasterizada con pistas bonus y booklet de fotos inéditas.",
    rating: 4.8,
    ratingCount: 214,
  },
  {
    id: "back-in-black-cd",
    img: cdImg,
    titulo: "Back in Black — AC/DC",
    precio: "$18.990",
    formato: "CD — Edición de coleccionista",
    artista: "AC/DC",
    año: "1980",
    etiqueta: "Thunder Records",
    descripcion:
      "Edición con portada de arte alternativo y notas de producción.",
    rating: 4.6,
    ratingCount: 176,
  },
  {
    id: "rumours-vinilo",
    img: viniloImg,
    titulo: "Rumours — Fleetwood Mac",
    precio: "$18.990",
    formato: "Vinilo 12\" (180g) — Edición limitada",
    artista: "Fleetwood Mac",
    año: "1977",
    etiqueta: "Harmony Records",
    descripcion:
      "Reedición en vinilo 180 g con portada original y libreto de 10 páginas.",
    rating: 4.7,
    ratingCount: 142,
  },
  {
    id: "the-dark-side-of-the-moon-vinilo",
    img: viniloImg,
    titulo: "The Dark Side of the Moon — Pink Floyd",
    precio: "$18.990",
    formato: "Vinilo 12\" (180g) — Edición limitada",
    artista: "Pink Floyd",
    año: "1973",
    etiqueta: "Prism Sound",
    descripcion:
      "Vinilo remasterizado con corte directo y encuadernación gatefold.",
    rating: 4.9,
    ratingCount: 231,
  },
  {
    id: "hotel-california-cd",
    img: cdImg,
    titulo: "Hotel California — Eagles",
    precio: "$18.990",
    formato: "CD — Edición deluxe",
    artista: "Eagles",
    año: "1976",
    etiqueta: "Desert Sky Records",
    descripcion:
      "Incluye pistas inéditas y un booklet de fotos de la era del álbum.",
    rating: 4.5,
    ratingCount: 119,
  },
  {
    id: "led-zeppelin-iv-vinilo",
    img: viniloImg,
    titulo: "Led Zeppelin IV — Led Zeppelin",
    precio: "$18.990",
    formato: "Vinilo 12\" (180g) — Edición limitada",
    artista: "Led Zeppelin",
    año: "1971",
    etiqueta: "Stone Tower Records",
    descripcion:
      "Vinilo 180 g con portada original y notas de la banda.",
    rating: 4.8,
    ratingCount: 198,
  },
  {
    id: "born-in-the-u.s.a.-cd",
    img: cdImg,
    titulo: "Born in the U.S.A. — Bruce Springsteen",
    precio: "$18.990",
    formato: "CD — Edición especial",
    artista: "Bruce Springsteen",
    año: "1984",
    etiqueta: "Heartland Records",
    descripcion:
      "Remasterización con pistas bonus y ensayo de la gira de 1985.",
    rating: 4.4,
    ratingCount: 102,
  },
  {
    id: "sgt.-pepper's-lonely-hearts-club-band-vinilo",
    img: viniloImg,
    titulo: "Sgt. Pepper's Lonely Hearts Club Band — The Beatles",
    precio: "$18.990",
    formato: "Vinilo 12\" (180g) — Edición limitada",
    artista: "The Beatles",
    año: "1967",
    etiqueta: "Pepper Records",
    descripcion:
      "Edición de coleccionista con portada original y libreto de 12 páginas.",
    rating: 4.9,
    ratingCount: 254,
  },
  {
    id: "nevermind-cd",
    img: cdImg,
    titulo: "Nevermind — Nirvana",
    precio: "$18.990",
    formato: "CD — Edición remasterizada",
    artista: "Nirvana",
    año: "1991",
    etiqueta: "Grunge Wave Records",
    descripcion:
      "Versión remasterizada con pistas extra y fotos de la era grunge.",
    rating: 4.6,
    ratingCount: 167,
  },
];



export default dataProducto;