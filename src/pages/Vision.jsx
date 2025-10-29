import React from 'react';
import '../styles/vision.css'

/**
 * Página estática: Visión de la empresa.
 * @returns {JSX.Element}
 */
function Vision() {
    return (
        <section class="vision-container" aria-labelledby="vision-title">
        <div class="vision-header">
            <h2 id="vision-title">Nuestra Visión</h2>
            <div class="vision-meta">Beat Bazaar — Compromiso con la música y la comunidad</div>
        </div>

        <div class="vision-body">
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, nisl sit amet gravida consequat, justo arcu aliquet nunc, at dictum neque lorem sed arcu. Sed condimentum, risus vitae volutpat tristique, velit sapien dignissim nibh, vitae efficitur lacus lorem non lacus. Vivamus nec aliquet nibh. Praesent facilisis urna eget sem fermentum, vitae fermentum nibh lacinia. Curabitur sit amet nisl sit amet neque tincidunt posuere. Nulla facilisi.
            </p>

            <p>
            Phasellus vitae eros id arcu interdum tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris ut orci sit amet lorem congue luctus. Cras ut magna vitae arcu molestie pharetra. Integer posuere, lorem at efficitur ultricies, urna purus condimentum purus, quis vulputate ligula erat non lectus.
            </p>

            <p>
            Aenean sed tortor eu urna dictum hendrerit. Aliquam erat volutpat. Vivamus id risus vitae augue varius molestie. Suspendisse potenti. Donec vitae nibh vitae arcu posuere hendrerit. Etiam non mi euismod, facilisis lacus id, cursus nisl. Sed at lorem id lorem vehicula interdum.
            </p>

            <p>
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer vulputate, sapien non convallis dapibus, urna quam consectetur leo, id vulputate purus turpis in urna. Nam sit amet tempus sapien. Morbi feugiat, purus in consequat cursus, lorem neque tristique neque, quis bibendum velit nibh eu lorem.
            </p>
        </div>
        </section>
    )
}

export default Vision;
