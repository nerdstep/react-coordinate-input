import { RE_DD, RE_DMS } from './regex'

/**
 * Fills an array with the provided value X number of times
 *
 * @param {array} arr     - array to fill
 * @param {*} value       - value to push to the array
 * @param {number} count  - number of items to add
 * @returns {array}       - array filled with values
 */
export function fill(arr, value, count) {
  for (let i = 0; i < count; i++) {
    arr.push(value)
  }
  return arr
}

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
 * Converts a DD string into a DMS string
 *
 * @param {string} value      - input value
 * @param {number} precision  - DMS decimal places
 * @returns {string}          - normalized DMS string
 */
export function convertInput(value, precision) {
  if (validateDD(value)) {
    const dd = value.split(',')
    const lat = decimalToDMS(dd[0], false, precision)
    const lon = decimalToDMS(dd[1], true, precision)
    value = serializeDMS(lat, lon)
  }
  return value
}

/**
 * Returns true if the provided value is a valid DD string
 *
 * @param {string} value  - input value
 * @returns {boolean}     - is valid DD?
 */
export function validateDD(value) {
  return RE_DD.test(value)
}

/**
 * Returns true if the provided value is a valid (normalized) DMS string
 *
 * @param {string} value  - input value
 * @returns {boolean}     - is valid DMS?
 */
export function validateDMS(value) {
  return RE_DMS.test(value)
}

/**
 * Parses a DMS string into an array of lat/lon arrays
 *
 * @param {string} value  - DMS value, e.g. '04:08:15:N:162:03:42:E'
 * @param {string} sep    - separator
 * @returns {array}       - [[D, M, S, 'N|S'], [D, M, S, 'E|W']]
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
 * Serializes DMS lat/lon arrays into a normalized DMS string
 *
 * @param {array} lat   - DMS latitude, e.g. [4, 8, 15, 'N']
 * @param {array} lon   - DMS longitude, e.g. [162, 3, 42, 'E']
 * @param {string} sep  - separator
 * @returns {string}    - '04:08:15:N:162:03:42:E'
 */
export function serializeDMS(lat, lon, sep = ':') {
  const res = []

  res[0] = lat
    .map(item => item.toString().replace(/^(\d)(\.\d+)?$/, '0$1$2'))
    .join(sep)

  res[1] = lon
    .map(
      (item, i) =>
        i === 0
          ? item
              .toString()
              .replace(/^(\d)$/, '00$1')
              .replace(/^(\d\d)$/, '0$1')
          : item.toString().replace(/^(\d)(\.\d+)?$/, '0$1$2')
    )
    .join(sep)

  return res.join(sep)
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
 * @param {number} dd         - decimal degree value
 * @param {boolean} isLon     - is longitude?
 * @param {number} precision  - decimal places for seconds
 * @returns {array}           - DMS values, e.g. [D, M, S, 'N|S|E|W']
 */
export function decimalToDMS(dd, isLon, precision = 0) {
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
