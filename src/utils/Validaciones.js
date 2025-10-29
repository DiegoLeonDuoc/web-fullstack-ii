export function isValidEmail(email) {
  return /^((?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/gm
    .test(String(email).trim());
}

// funciones rut
export function normalizeRut(rut) {
  return String(rut).replace(/\./g, '').replace(/\s+/g, '').toLowerCase();
}

export function isRutFormat(rut) {
  return /^[0-9]+-[0-9k]{1}$/.test(normalizeRut(rut));
}

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

export function isValidRut(rut) {
  const norm = normalizeRut(rut);
  if (!isRutFormat(norm)) return false;
  const [num, vd] = norm.split('-');
  if (!/^[0-9]+$/.test(num)) return false;
  return computeRutDV(num) === vd;
}

// funciones contraseña y edad
export function isValidPassword(pw) {
  if (typeof pw !== 'string') return false;
  if (pw.length < 8 || pw.length > 30) return false;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  return hasLower && hasUpper && hasDigit && hasSymbol;
}

export function isValidAge(age) {
  const n = parseInt(age, 10);
  return n >= 18 && n <= 120;
}
