/**
 * Latitude/Longitude as Degrees, Minutes, Seconds
 * Regexr: https://regexr.com/3qgn3
 *
 * Range check for minutes and seconds (0-59)
 * Max latitude 90:00:00, Max longitude 180:00:00
 *
 * Matches:
 * 90:00:00N 180:00:00E | 34:59:33S 179:59:59W | 00:00:00N 000:00:00W
 * 34:59:33.123S 179:59:59.999W | 90:00:00.000N 180:00:00.000E
 * 45:06:42:N:034:56:46:E (normalized format)
 *
 * Non-matches:
 * 91:00:00N 181:00:00E | 34:59:33Z 179:59:59W | 00:00:00N 181:00:00W
 * 90:00:00.001N 180:00:00.001E
 *
 * Groups:
 * [1] 90:00:00.000
 * [2] N
 * [3] 180:00:00.000
 * [4] E
 */
export const RE_DMS = /^([0-8][0-9](?::[0-5]\d)(?::[0-5]\d(?:\.\d{1,3})?)|90(?::00)(?::00)(?:\.0{1,3})?)(?:\s|:)?([NS])(?:\s|:)?((?:0\d\d|1[0-7]\d)(?::[0-5]\d)(?::[0-5]\d(?:\.\d{1,3})?)|180(?::00)(?::00)(?:\.0{1,3})?)(?:\s|:)?([EW])$/

/**
 * Returns a normalized DMS input value
 *
 * @param {string} value  - input value
 * @param {string} sep    - value separator
 * @returns {string}      - normalized value
 */
export function normalizeInput(value = '', sep = ':') {
  return value.replace(/[^0-9\.NSEW]/gi, sep).replace(/:{2,}/g, sep)
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
  return RE_DMS.test(value)
}

/**
 * Parse a DMS string into an object with latitude & longitude values
 *
 * @param {string} value  - DMS value, e.g. '45:06:42:N:034:56:46:E'
 * @param {string} sep    - separator
 * @returns {array}       - [[<D>, <M>, <S>], [<D>, <M>, <S>]]
 */
export function parseDMS(value, sep = ':') {
  const match = value.match(RE_DMS).slice(1)
  const lat = match[0].split(sep).map(n => parseInt(n, 10))
  const latDir = match[1]
  const lon = match[2].split(sep).map(n => parseInt(n, 10))
  const lonDir = match[3]

  if (latDir === 'S') lat[0] = -lat[0]
  if (lonDir === 'W') lon[0] = -lon[0]

  return [[lat[0], lat[1], lat[2]], [lon[0], lon[1], lon[2]]]
}

/**
 * Converts Degrees Minutes Seconds to Decimal Degrees
 *
 * Formula:
 * DD = D + M / 60 + S / 3600
 *
 * @param {number} degrees    - degrees
 * @param {number} minutes    - minutes
 * @param {number} seconds    - seconds
 * @param {number} precision  - decimal places
 * @returns {number}          - decimal degrees
 */
export function dmsToDecimal(degrees, minutes, seconds, precision = 6) {
  const factor = Math.pow(10, precision)
  const dd = degrees + minutes / 60 + seconds / 3600
  // Round the result to the given precision
  return Math.round(dd * factor) / factor
}

/**
 *
 * @param {*} dd
 */
export function decimalToDMS(dd, isLon) {
  const dir = dd < 0 ? (isLon ? 'W' : 'S') : isLon ? 'E' : 'N'
  //d = integer(30.263888889°) = 30°
  //m = integer((dd - d) × 60) = 15'
  //s = (dd - d - m/60) × 3600 = 50"
  let d = parseInt(dd, 0)
  let m = Math.floor((dd - d) * 60)
  let s = Math.round((dd - d - m / 60) * 3600)

  d = Math.abs(d)
  m = m < 10 ? `0${m}` : m
  s = s < 10 ? `0${s}` : s

  return `${d}.${m}.${s}${dir}`
}
