// Example valid matches:
// 90.00.00N 180.00.00E | 34.59.33S 179.59.59W | 00.00.00N 000.00.00W
export const RE_LAT_LONG = /^([0-8][0-9](?:\.[0-5]\d){2}|90(?:\.00){2})([NS])\s?((?:0\d\d|1[0-7]\d)(?:\.[0-5]\d){2}|180(?:\.00){2})([EW])$/

/**
 * Returns an input normalization function using the provided symbols
 *
 * @param {object} symbols
 * @param {string} symbols.degree
 * @param {string} symbols.minute
 * @param {string} symbols.second
 * @param {string} symbols.spacer
 * @returns {function}
 */
export function createInputNormalizer({ degree, minute, second, spacer }) {
  const reSpacer = new RegExp(spacer, 'g')
  const reDeg = new RegExp(degree, 'g')
  const reMin = new RegExp(minute, 'g')
  const reSec = new RegExp(second, 'g')

  return (value = '') =>
    value
      .replace(reSpacer, '')
      .replace(reDeg, '.')
      .replace(reMin, '.')
      .replace(reSec, '')
}

/**
 * Returns an input mask using the provided symbols
 *
 * @param {object} symbols
 * @param {string} symbols.degree
 * @param {string} symbols.minute
 * @param {string} symbols.second
 * @param {string} symbols.spacer
 * @return {array} - input mask
 */
export function createInputMask({ degree, minute, second, spacer }) {
  const lat = [].concat(
    [/\d/, /\d/, degree, spacer],
    [/\d/, /\d/, minute, spacer],
    [/\d/, /\d/, second, spacer],
    [/[nNsS]/, spacer]
  )
  const lon = [].concat(
    [/\d/, /\d/, /\d/, degree, spacer],
    [/\d/, /\d/, minute, spacer],
    [/\d/, /\d/, second, spacer],
    [/[eEwW]/]
  )

  return [].concat(lat, lon)
}

/**
 * Returns true if the provided input is a valid DMS string
 *
 * @param {string} value   - input value
 * @returns {boolean}
 */
export function validateDMS(value) {
  return RE_LAT_LONG.test(value)
}

/**
 * Parse a DMS string into an object with latitude & longitude values
 *
 * @param {string} value  - input value
 * @returns {object}
 */
export function parseDMS(value) {
  const match = value.match(RE_LAT_LONG).slice(1)
  const lat = match[0].split('.').map(n => parseInt(n, 10))
  const latDir = match[1]
  const lon = match[2].split('.').map(n => parseInt(n, 10))
  const lonDir = match[3]

  if (latDir === 'S') lat[0] = -lat[0]
  if (lonDir === 'W') lon[0] = -lon[0]

  return {
    lat: { d: lat[0], m: lat[1], s: lat[2] },
    lon: { d: lon[0], m: lon[1], s: lon[2] },
  }
}

/**
 * Converts Degrees Minutes Seconds to Decimal Degrees
 *
 * @param {object} dms    - DMS object
 * @param {number} dms.d  - degrees
 * @param {number} dms.m  - minutes
 * @param {number} dms.s  - seconds
 * @returns {number}      - decimal degrees
 */
export function dmsToDecimal({ d, m, s }) {
  const factor = Math.pow(10, 8)
  const x = d + m / 60 + s / 3600
  // Round the result to a precision of 8
  return Math.round(x * factor) / factor
}
