function DataFilas() {

  const artistasSlides = [
    [
      <a className="ficha" href="/producto">Taylor Swift</a>,
      <a className="ficha" href="/producto">Drake</a>,
      <a className="ficha" href="/producto">Bad Bunny</a>,
      <a className="ficha" href="/producto">The Weeknd</a>,
      <a className="ficha" href="/producto">BTS</a>,
    ],
    [
      <a className="ficha" href="/producto">Billie Eilish</a>,
      <a className="ficha" href="/producto">Ed Sheeran</a>,
      <a className="ficha" href="/producto">Ariana Grande</a>,
      <a className="ficha" href="/producto">Post Malone</a>,
      <a className="ficha" href="/producto">Justin Bieber</a>,
    ],
    [
      <a className="ficha" href="/producto">Karol G</a>,
      <a className="ficha" href="/producto">Olivia Rodrigo</a>,
      <a className="ficha" href="/producto">Harry Styles</a>,
      <a className="ficha" href="/producto">Dua Lipa</a>,
      <a className="ficha" href="/producto">J Balvin</a>,
    ],
    [
      <a className="ficha" href="/producto">Rihanna</a>,
      <a className="ficha" href="/producto">SZA</a>,
      <a className="ficha" href="/producto">Travis Scott</a>,
      <a className="ficha" href="/producto">BLACKPINK</a>,
      <a className="ficha" href="/producto">Shawn Mendes</a>,
    ],
];

  // const albumImg = "https://lh3.googleusercontent.com/68eGl8DSkl7mleAJqQP6Ata_ZqQEB743Tq14CDu3KQQRSv54kOUFWivzsJ_oPFqrrdvnfihRVjXUEM4=w1440-h810-l90-rj";
  const viniloImg = "/images/Vinilo.png";
  const cdImg = "/images/CD.png";


  const recomendacionesSlides = [
    {img: viniloImg, alt: "Abbey Road", titulo: "Abbey Road", precio: "12.990", formato: "Vinilo", artista: "The Beatles" },
    {img: cdImg, alt: "Thriller", titulo: "Thriller", precio: "12.990", formato: "CD", artista: "Michael Jackson" },
    {img: cdImg, alt: "Back in Black", titulo: "Back in Black", precio: "12.990", formato: "CD", artista: "AC/DC" },
    {img: viniloImg, alt: "Rumours", titulo: "Rumours", precio: "12.990", formato: "Vinilo", artista: "Fleetwood Mac" },
    {img: viniloImg, alt: "The Dark Side of the Moon", titulo: "The Dark Side of the Moon", precio: "12.990", formato: "Vinilo", artista: "Pink Floyd" },
    {img: cdImg, alt: "Hotel California", titulo: "Hotel California", precio: "12.990", formato: "CD", artista: "Eagles" },
    {img: viniloImg, alt: "Led Zeppelin IV", titulo: "Led Zeppelin IV", precio: "12.990", formato: "Vinilo", artista: "Led Zeppelin" },
    {img: cdImg, alt: "Born in the U.S.A.", titulo: "Born in the U.S.A.", precio: "12.990", formato: "CD", artista: "Bruce Springsteen" },
    {img: viniloImg, alt: "Sgt. Pepper's Lonely Hearts Club Band", titulo: "Sgt. Pepper's Lonely Hearts Club Band", precio: "12.990", formato: "Vinilo", artista: "The Beatles" },
    {img: cdImg, alt: "Nevermind", titulo: "Nevermind", precio: "12.990", formato: "CD", artista: "Nirvana" }
  ];

  const mejoresSlides = [
    {img: cdImg, alt: "21", titulo: "21", precio: "12.990", formato: "CD", artista: "Adele" },
    {img: viniloImg, alt: "Revolver", titulo: "Revolver", precio: "12.990", formato: "Vinilo", artista: "The Beatles" },
    {img: cdImg, alt: "OK Computer", titulo: "OK Computer", precio: "12.990", formato: "CD", artista: "Radiohead" },
    {img: viniloImg, alt: "Purple Rain", titulo: "Purple Rain", precio: "12.990", formato: "Vinilo", artista: "Prince" },
    {img: cdImg, alt: "Appetite for Destruction", titulo: "Appetite for Destruction", precio: "12.990", formato: "CD", artista: "Guns N' Roses" },
    {img: viniloImg, alt: "A Night at the Opera", titulo: "A Night at the Opera", precio: "12.990", formato: "Vinilo", artista: "Queen" },
    {img: viniloImg, alt: "The Wall", titulo: "The Wall", precio: "12.990", formato: "Vinilo", artista: "Pink Floyd" },
    {img: cdImg, alt: "Hotel California (Deluxe)", titulo: "Hotel California (Deluxe)", precio: "12.990", formato: "CD", artista: "Eagles" },
    {img: viniloImg, alt: "Back to Black", titulo: "Back to Black", precio: "12.990", formato: "Vinilo", artista: "Amy Winehouse" },
    {img: cdImg, alt: "Kind of Blue", titulo: "Kind of Blue", precio: "12.990", formato: "CD", artista: "Miles Davis" }
  ];




  return {
    artistasSlides,
    recomendacionesSlides,
    mejoresSlides
  };
}

export default DataFilas;