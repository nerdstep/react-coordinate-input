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
export const RE_DMS = /^((?:\d|[0-8][0-9])(?::(?:[0-5]\d|\d))(?::(?:[0-5]\d|\d)(?:\.\d{1,3})?)|90(?::00)(?::00)(?:\.0{1,3})?)(?:\s|:)?([NS])(?:\s|:)?((?:0?\d\d|0?0?\d|1[0-7]\d)(?::(?:[0-5]\d|\d))(?::(?:[0-5]\d|\d)(?:\.\d{1,3})?)|180(?::00)(?::00)(?:\.0{1,3})?)(?:\s|:)?([EW])$/

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
 * Returns true if the provided input is a valid (normalized) DMS string
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
 * @param {string} value  - DMS value, e.g. '04:08:15:N:162:03:42:E'
 * @param {string} sep    - separator
 * @returns {array}       - [[<D>, <M>, <S>, '<N|S>'], [<D>, <M>, <S>, '<E|W>']]
 */
export function parseDMS(value, sep = ':') {
  const match = value.match(RE_DMS).slice(1)

  const lat = match[0].split(sep).map(n => parseFloat(n))
  const lon = match[2].split(sep).map(n => parseFloat(n))

  return [
    [lat[0], lat[1], lat[2], match[1]],
    [lon[0], lon[1], lon[2], match[3]],
  ]
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
 * @param {string} direction  - compass direction
 * @param {number} precision  - decimal places
 * @returns {number}          - decimal degrees
 */
export function dmsToDecimal(
  degrees,
  minutes,
  seconds,
  direction,
  precision = 6
) {
  const factor = Math.pow(10, precision)
  let dd = degrees + minutes / 60 + seconds / 3600
  // Round the result to the given precision
  dd = Math.round(dd * factor) / factor
  // If direction is South or West then value is negative
  return /S|W/.test(direction) ? dd * -1 : dd
}

/**
 * Converts Decimal Degress to Degrees Minutes Seconds
 *
 * @param {number} dd     - decimal degree value
 * @param {boolean} isLon - is longitude?
 * @returns {array}       - DMS values, e.g. [<D>, <M>, <S>, '<N|S|E|W>']
 */
export function decimalToDMS(dd, isLon, precision = 3) {
  const factor = Math.pow(10, precision)
  const dir = dd < 0 ? (isLon ? 'W' : 'S') : isLon ? 'E' : 'N'

  let d = parseInt(dd, 10) // truncate dd to get degrees
  const frac = Math.abs(dd - d) // get fractional part
  const m = parseInt(frac * 60, 10) // multiply fraction by 60 and truncate
  let s = frac * 3600 - m * 60

  // Round the result to the given precision
  s = Math.round(s * factor) / factor
  // Ensure degrees is a positive value,
  // since we're returning direction as a string value
  d = Math.abs(d)

  return [d, m, s, dir]
}
