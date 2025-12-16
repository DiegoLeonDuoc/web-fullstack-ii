/**
 * Valida si un string tiene un formato de email válido.
 * 
 * Usa una expresión regular compleja que verifica:
 * - Parte local (antes del @): acepta letras, números y símbolos válidos
 * - @ obligatorio
 * - Dominio: debe tener al menos un punto y extensión de 2+ caracteres
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email tiene formato válido, false en caso contrario
 * 
 * Ejemplos:
 * isValidEmail("user@example.com") // true
 * isValidEmail("invalid.email") // false
 * isValidEmail("test@domain") // false (falta extensión)
 */
export function isValidEmail(email) {
  return /^((?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/gm
    .test(String(email).trim());
}

// ========== Funciones de Validación de RUT Chileno ==========

/**
 * Normaliza un RUT removiendo puntos y espacios y transformando a minúsculas.
 * 
 * El RUT chileno puede venir en varios formatos:
 * - "12.345.678-9"
 * - "12345678-9"
 * - "12 345 678-9"
 * 
 * Esta función lo convierte a: "12345678-9"
 * 
 * @param {string} rut - RUT a normalizar
 * @returns {string} RUT normalizado (sin puntos ni espacios, minúsculas)
 * 
 * Ejemplo:
 * normalizeRut("12.345.678-9") // "12345678-9"
 * normalizeRut("12.345.678-K") // "12345678-k"
 */
export function normalizeRut(rut) {
  return String(rut).replace(/\./g, '').replace(/\s+/g, '').toLowerCase();
}

/**
 * Verifica si el RUT normalizado cumple el formato básico NNNNNNNN-DV.
 * 
 * Solo valida el formato, NO valida si el dígito verificador es correcto.
 * Para validación completa usar isValidRut().
 * 
 * Formato esperado: uno o más dígitos, guión, y exactamente un carácter (dígito o 'k')
 * 
 * @param {string} rut - RUT a evaluar (se normaliza internamente)
 * @returns {boolean} True si el formato es válido
 * 
 * Ejemplos:
 * isRutFormat("12345678-9") // true
 * isRutFormat("12345678-k") // true
 * isRutFormat("12345678") // false (falta guión)
 * isRutFormat("123-45") // true (formato válido, aunque no sea RUT real)
 */
export function isRutFormat(rut) {
  return /^[0-9]+-[0-9k]{1}$/.test(normalizeRut(rut));
}

/**
 * Calcula el dígito verificador (DV) de un RUT dado su parte numérica.
 * 
 * Usa el algoritmo oficial de validación de RUT chileno:
 * 1. Recorre los dígitos de derecha a izquierda
 * 2. Multiplica cada dígito por un factor que va de 2 a 7 (cíclico)
 * 3. Suma todos los productos
 * 4. Calcula el módulo 11
 * 5. Resta de 11: el resultado es el DV (casos especiales: 11->0, 10->k)
 * 
 * @param {string} numPart - Parte numérica del RUT (solo dígitos, sin guión ni DV)
 * @returns {"0"|"k"|string} Dígito verificador calculado
 * 
 * Ejemplo:
 * computeRutDV("12345678") // "5" (el DV correcto para este RUT)
 * 
 * Nota: Este es el algoritmo estándar usado en Chile para validar RUTs.
 */
export function computeRutDV(numPart) {
  let sum = 0;
  let factor = 2;

  // Recorrer de derecha a izquierda
  for (let i = numPart.length - 1; i >= 0; i--) {
    sum += parseInt(numPart.charAt(i), 10) * factor;
    // Factor va de 2 a 7 y luego vuelve a 2
    factor = factor === 7 ? 2 : factor + 1;
  }

  // Calcular DV
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return '0';  // Caso especial: 11 -> 0
  if (remainder === 10) return 'k';  // Caso especial: 10 -> k
  return String(remainder);
}

/**
 * Valida completamente un RUT chileno (formato Y dígito verificador).
 * 
 * Realiza validación en dos etapas:
 * 1. Verifica que tenga formato correcto (normalizeRut + isRutFormat)
 * 2. Calcula el DV esperado y lo compara con el proporcionado
 * 
 * Esta es la validación definitiva de RUT. Si retorna true, el RUT es válido.
 * 
 * @param {string} rut - RUT a validar (acepta cualquier formato)
 * @returns {boolean} True si el RUT es completamente válido
 * 
 * Ejemplos:
 * isValidRut("12.345.678-5") // true (RUT válido)
 * isValidRut("12.345.678-9") // false (DV incorrecto)
 * isValidRut("12345678") // false (falta guión y DV)
 * 
 * Uso típico en formularios:
 * if (!isValidRut(inputRut)) {
 *   alert("RUT inválido");
 * }
 */
export function isValidRut(rut) {
  // Normalizar formato
  const norm = normalizeRut(rut);

  // Verificar formato básico
  if (!isRutFormat(norm)) return false;

  // Separar número y dígito verificador
  const [num, vd] = norm.split('-');

  // Validar que la parte numérica solo tenga dígitos
  if (!/^[0-9]+$/.test(num)) return false;

  // Calcular DV esperado y comparar
  return computeRutDV(num) === vd;
}

// ========== Funciones de Validación de Contraseña y Edad ==========

/**
 * Verifica si una contraseña cumple con los requisitos de seguridad mínimos.
 * 
 * Requisitos obligatorios:
 * - Longitud: entre 8 y 30 caracteres
 * - Al menos una minúscula (a-z)
 * - Al menos una mayúscula (A-Z)
 * - Al menos un dígito (0-9)
 * - Al menos un símbolo especial (!@#$%^&*()_+-=[]{}|;:,.<>?)
 * 
 * Estos requisitos ayudan a prevenir contraseñas débiles.
 * 
 * @param {string} pw - Contraseña a validar
 * @returns {boolean} True si la contraseña cumple todos los requisitos
 * 
 * Ejemplos:
 * isValidPassword("Abc123!@") // true (cumple todos los requisitos)
 * isValidPassword("abc123!@") // false (falta mayúscula)
 * isValidPassword("Abc!") // false (muy corta, falta número)
 * isValidPassword("ABCDEFGH123!") // false (falta minúscula)
 * 
 * Uso en formularios:
 * if (!isValidPassword(password)) {
 *   setError("La contraseña debe tener 8-30 caracteres, mayúscula, minúscula, número y símbolo");
 * }
 */
export function isValidPassword(pw) {
  if (typeof pw !== 'string') return false;

  // Verificar longitud
  if (pw.length < 8 || pw.length > 30) return false;

  // Verificar requisitos de caracteres
  const hasLower = /[a-z]/.test(pw);      // Minúscula
  const hasUpper = /[A-Z]/.test(pw);      // Mayúscula
  const hasDigit = /[0-9]/.test(pw);      // Número
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);  // Símbolo (cualquier cosa que no sea letra o número)

  return hasLower && hasUpper && hasDigit && hasSymbol;
}

/**
 * Valida si la edad está en el rango permitido para registro.
 * 
 * El sistema solo permite registrar usuarios mayores de edad (18+)
 * y establece un límite superior razonable de 120 años.
 * 
 * @param {string|number} age - Edad a validar (se convierte a número internamente)
 * @returns {boolean} True si 18 <= edad <= 120
 * 
 * Ejemplos:
 * isValidAge(25) // true
 * isValidAge("18") // true (convierte string a número)
 * isValidAge(17) // false (menor de edad)
 * isValidAge(150) // false (excede límite superior)
 * 
 * Uso en formulario de registro:
 * if (!isValidAge(userAge)) {
 *   alert("Debe ser mayor de 18 años");
 * }
 */
export function isValidAge(age) {
  const n = parseInt(age, 10);
  return n >= 18 && n <= 120;
}

// ========== Funciones de Precio ==========

/**
 * Verifica si el precio es válido según las reglas de negocio.
 * 
 * Regla: El precio mínimo para productos es $1.000 CLP.
 * Esto previene errores de ingreso y mantiene consistencia de precios.
 * 
 * @param {string|number} price - Precio a validar (acepta número o string)
 * @returns {boolean} True si precio >= $1.000
 * 
 * Ejemplos:
 * isValidPrice(5000) // true
 * isValidPrice("15000") // true (convierte string a número)
 * isValidPrice(500) // false (menor al mínimo)
 * isValidPrice("abc") // false (no es número)
 * 
 * Uso en formulario de productos:
 * if (!isValidPrice(productPrice)) {
 *   setError("El precio debe ser mayor o igual a $1.000");
 * }
 */
export function isValidPrice(price) {
  let n = typeof price === 'string' ? parseInt(price, 10) : price;
  return n >= 1000;
}

/**
 * Formatea un número a formato de moneda chilena CLP.
 * 
 * Convierte números a formato legible con signo peso y separadores de miles.
 * Maneja varios formatos de entrada (números, strings, valores ya formateados).
 * 
 * @param {number|string} price - Precio a formatear
 * @returns {string} Precio formateado (ej: "$10.000", "$1.500.000")
 * 
 * Ejemplos:
 * formatPrice(10000) // "$10.000"
 * formatPrice("15000") // "$15.000"
 * formatPrice(1500000) // "$1.500.000"
 * formatPrice("$10.000") // "$10.000" (ya formateado, lo retorna sin cambios)
 * formatPrice(null) // "$0"
 * 
 * Usos comunes:
 * - Mostrar precios en la UI: <span>{formatPrice(product.precio)}</span>
 * - Tablas de productos
 * - Resumen de carrito de compras
 * 
 * Nota: Usa toLocaleString('es-CL') para formato correcto con puntos como separadores de miles.
 */
export function formatPrice(price) {
  // Manejar valores null/undefined
  if (price === null || price === undefined) return '$0';

  let n = price;

  // Si es string
  if (typeof price === 'string') {
    // Si ya tiene $, asumir que ya está formateado
    if (price.includes('$')) return price;

    // Limpiar cualquier carácter no numérico y convertir
    n = parseInt(price.replace(/[^\d]/g, ''), 10);
  }

  // Validar que sea número
  if (isNaN(n)) return '$0';

  // Formatear con separadores de miles (formato chileno)
  return '$' + n.toLocaleString('es-CL');
}
