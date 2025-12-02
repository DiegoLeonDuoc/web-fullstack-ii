/**
 * Valida si un string tiene un formato de email válido.
 * @param {string} email - Email a validar.
 * @returns {boolean} True si el email tiene formato válido, de lo contrario false.
 */
export function isValidEmail(email) {
  return /^((?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/gm
    .test(String(email).trim());
}

// funciones rut
/**
 * Normaliza un RUT removiendo puntos y espacios y transformando a minúsculas.
 * @param {string} rut - RUT a normalizar.
 * @returns {string} RUT normalizado.
 */
export function normalizeRut(rut) {
  return String(rut).replace(/\./g, '').replace(/\s+/g, '').toLowerCase();
}

/**
 * Verifica si el RUT normalizado cumple el formato NNNNNNNN-DV.
 * @param {string} rut - RUT a evaluar (se normaliza internamente).
 * @returns {boolean} True si el formato es válido.
 */
export function isRutFormat(rut) {
  return /^[0-9]+-[0-9k]{1}$/.test(normalizeRut(rut));
}

/**
 * Calcula el dígito verificador (DV) de un RUT dado su parte numérica.
 * @param {string} numPart - Parte numérica del RUT (solo dígitos).
 * @returns {"0"|"k"|string} Dígito verificador calculado.
 */
export function computeRutDV(numPart) {
  let sum = 0;
  let factor = 2;
  for (let i = numPart.length - 1; i >= 0; i--) {
    sum += parseInt(numPart.charAt(i), 10) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return '0';
  if (remainder === 10) return 'k';
  return String(remainder);
}

/**
 * Valida completamente un RUT chileno (formato y DV).
 * @param {string} rut - RUT a validar.
 * @returns {boolean} True si el RUT es válido.
 */
export function isValidRut(rut) {
  const norm = normalizeRut(rut);
  if (!isRutFormat(norm)) return false;
  const [num, vd] = norm.split('-');
  if (!/^[0-9]+$/.test(num)) return false;
  return computeRutDV(num) === vd;
}

// funciones contraseña y edad
/**
 * Verifica si una contraseña cumple con los requisitos mínimos.
 * Requisitos: 8-30 caracteres, minúscula, mayúscula, dígito y símbolo.
 * @param {string} pw - Contraseña a validar.
 * @returns {boolean} True si la contraseña es válida.
 */
export function isValidPassword(pw) {
  if (typeof pw !== 'string') return false;
  if (pw.length < 8 || pw.length > 30) return false;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  return hasLower && hasUpper && hasDigit && hasSymbol;
}

/**
 * Valida si la edad está en el rango permitido.
 * @param {string|number} age - Edad a validar.
 * @returns {boolean} True si 18 <= edad <= 120.
 */
export function isValidAge(age) {
  const n = parseInt(age, 10);
  return n >= 18 && n <= 120;
}

/**
 * Verifica si el precio es válido (>= $1.000)
 * @param {string|number} price Precio a validar
 * @returns {boolean}
 */
export function isValidPrice(price) {
  let n = typeof price === 'string' ? parseInt(price, 10) : price;
  return n >= 1000;
}

/**
 * Formatea un número a formato de moneda CLP (ej: $10.000)
 * @param {number|string} price - Precio a formatear
 * @returns {string} Precio formateado
 */
export function formatPrice(price) {
  if (price === null || price === undefined) return '$0';
  // Si ya tiene formato, intentar limpiar
  let n = price;
  if (typeof price === 'string') {
    if (price.includes('$')) return price; // Asumir ya formateado
    n = parseInt(price.replace(/[^\d]/g, ''), 10);
  }
  if (isNaN(n)) return '$0';
  return '$' + n.toLocaleString('es-CL');
}
