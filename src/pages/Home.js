// src/pages/Home.js
import React from 'react';
import Carousel from '../components/Carousel';

function Home() {
    // === Slides data ===
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

    const albumImg =
    "https://lh3.googleusercontent.com/68eGl8DSkl7mleAJqQP6Ata_ZqQEB743Tq14cdu3KQQRSv54kOUFWivzsJ_oPFqrrdvnfihRVjXUEM4=w1440-h810-l90-rj";

            const recomendacionesSlides = [
                [
                    { href: "/producto", img: albumImg, alt: "Album 1", title: "Album Title 1", price: "12.990" },
                    { href: "/producto", img: albumImg, alt: "Album 2", title: "Album Title 2" },
                    { href: "/producto", img: albumImg, alt: "Album 3", title: "Album Title 3" },
                    { href: "/producto", img: albumImg, alt: "Album 4", title: "Album Title 4" },
                    { href: "/producto", img: albumImg, alt: "Album 5", title: "Album Title 5" },
                ],
                [
                    { href: "/producto", img: albumImg, alt: "Album 6", title: "Album Title 6" },
                    { href: "/producto", img: albumImg, alt: "Album 7", title: "Album Title 7" },
                    { href: "/producto", img: albumImg, alt: "Album 8", title: "Album Title 8" },
                    { href: "/producto", img: albumImg, alt: "Album 9", title: "Album Title 9" },
                    { href: "/producto", img: albumImg, alt: "Album 10", title: "Album Title 10" },
                ],
            ];

            const mejoresSlides = [
                [
                    { href: "/producto", img: albumImg, alt: "Album 11", title: "Album Title 1" },
                    { href: "/producto", img: albumImg, alt: "Album 12", title: "Album Title 2" },
                    { href: "/producto", img: albumImg, alt: "Album 13", title: "Album Title 3" },
                    { href: "/producto", img: albumImg, alt: "Album 14", title: "Album Title 4" },
                    { href: "/producto", img: albumImg, alt: "Album 15", title: "Album Title 5" },
                ],
                [
                    { href: "/producto", img: albumImg, alt: "Album 16", title: "Album Title 6" },
                    { href: "/producto", img: albumImg, alt: "Album 17", title: "Album Title 7" },
                    { href: "/producto", img: albumImg, alt: "Album 18", title: "Album Title 8" },
                    { href: "/producto", img: albumImg, alt: "Album 19", title: "Album Title 9" },
                    { href: "/producto", img: albumImg, alt: "Album 20", title: "Album Title 10" },
                ],
            ];

            return (
                <div>
                <h2><b>Artistas populares</b></h2>
                <Carousel id="carrusel-fichas" slides={artistasSlides} controls />

                <h2 className="mt-5">Recomendaciones</h2>
                <Carousel id="carrusel-albumes-1" slides={recomendacionesSlides} controls />

                <h2 className="mt-5">Lo mejor del 2025</h2>
                <Carousel id="carrusel-albumes-2" slides={mejoresSlides} controls />
                </div>
            );
}

export default Home;
