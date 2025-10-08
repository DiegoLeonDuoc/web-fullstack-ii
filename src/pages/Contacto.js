import React from 'react';
import '../styles/contacto.css';
function Contacto() {
    return(
        <section class="contact-container">
            <h2>Contáctanos</h2>
            <p class="form-note">Envíanos un mensaje. <strong>Máximo 1000 caracteres</strong>.</p>

            <form id="contact-form" novalidate>
                <div class="form-group">
                    <label for="email">Email <span class="required">*</span></label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="tu@correo.com" required></input>
                    <div id="email-error" class="error" aria-live="polite" style={{display:'none'}}>Por favor ingresa un correo válido.</div>
                </div>

                <div class="form-group">
                    <label for="message">Mensaje <span class="required">*</span></label>
                    <textarea id="message" name="message" class="form-control" maxlength="1000" placeholder="Escribe tu mensaje aquí..." required></textarea>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <div id="message-error" class="error" style={{display:'none'}}>El mensaje no puede estar vacío.</div>
                        <div class="char-count" id="char-count">0 / 1000</div>
                    </div>
                </div>

                <div class="form-group mt-3">
                    <button type="submit" class="btn btn-primary">Enviar Mensaje</button>
                    <span id="form-status" class="ml-3" aria-live="polite"></span>
                </div>
            </form>
        </section>
    );
}

export default Contacto;
