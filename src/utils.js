// @ts-check
import { RE_DD, RE_DMS } from './regex'

/**
 * fill
 *
 * Fills an array with the provided value X number of times
 *
 * @param {any[]} arr Array to fill
 * @param {any} value Value to push to the array
 * @param {number} count Number of items to add
 * @returns {any[]} Array filled with values
 */
export function fill(arr, value, count) {
  for (let i = 0; i < count; i++) {
    arr.push(value)
  }
  return arr
}

/**
 * normalizeInput
 *
 * Returns a normalized DMS input value
 *
 * @param {string} value Input value
 * @param {string} sep Value separator
 * @returns {string} Normalized value
 */
export function normalizeInput(value = '', sep = ':') {
  return value.replace(/[^0-9\.NSEW]/gi, sep).replace(/:{2,}/g, sep)
}

/**
 * convertInput
 *
 * Converts a DD string into a DMS string
 *
 * @param {string} value Input value
 * @param {number} precision DMS decimal places
 * @returns {string} Normalized DMS string
 */
export function convertInput(value, precision) {
  if (validateDD(value)) {
    const dd = value.split(',')
    const lat = parseFloat(dd[0])
    const lon = parseFloat(dd[1])
    const latArr = decimalToDMS(lat, false, precision)
    const lonArr = decimalToDMS(lon, true, precision)
    value = serializeDMS(latArr, lonArr)
  }
  return value
}

/**
 * validateDD
 *
 * Returns true if the provided value is a valid DD string
 *
 * @param {string} value Input value
 * @returns {boolean} Is valid DD?
 */
export function validateDD(value) {
  return RE_DD.test(value)
}

/**
 * Returns true if the provided value is a valid (normalized) DMS string
 *
 * @param {string} value Input value
 * @returns {boolean} Is valid DMS?
 */
export function validateDMS(value) {
  return RE_DMS.test(value)
}

/**
 * parseDMS
 *
 * Parses a DMS string into an array of lat/lon arrays
 *
 * @param {string} value DMS value, e.g. '04:08:15:N:162:03:42:E'
 * @param {string} sep Separator
 * @returns {((string|number)[])[]} [[D, M, S, 'N|S'], [D, M, S, 'E|W']]
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
 * serializeDMS
 *
 * Serializes DMS lat/lon arrays into a normalized DMS string
 *
 * @param {(string|number)[]} lat DMS latitude, e.g. [4, 8, 15, 'N']
 * @param {(string|number)[]} lon DMS longitude, e.g. [162, 3, 42, 'E']
 * @param {string} sep Separator
 * @returns {string}
 * @example `04:08:15:N:162:03:42:E`
 */
export function serializeDMS(lat, lon, sep = ':') {
  const res = []

  res[0] = lat
    .map(item => item.toString().replace(/^(\d)(\.\d+)?$/, '0$1$2'))
    .join(sep)

  res[1] = lon
    .map((item, i) =>
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
 * dmsToDecimal
 *
 * Converts Degrees Minutes Seconds to Decimal Degrees
 *
 * Formula:
 * DD = D + M / 60 + S / 3600
 *
 * @param {number} degrees
 * @param {number} minutes
 * @param {number} seconds
 * @param {string} direction Compass direction, e.g. N|S|E|W
 * @param {number} precision  Decimal places
 * @returns {number} Decimal degrees
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
 * decimalToDMS
 *
 * Converts Decimal Degress to Degrees Minutes Seconds
 *
 * @param {number} dd Decimal degree value
 * @param {boolean} isLon Is longitude?
 * @param {number} precision Decimal places for seconds
 * @returns {(string|number)[]} DMS values, e.g. [D, M, S, 'N|S|E|W']
 */
export function decimalToDMS(dd, isLon, precision = 0) {
  const factor = Math.pow(10, precision)
  const dir = dd < 0 ? (isLon ? 'W' : 'S') : isLon ? 'E' : 'N'

  let d = Math.trunc(dd) // truncate dd to get degrees
  const frac = Math.abs(dd - d) // get fractional part
  const m = Math.trunc(frac * 60) // multiply fraction by 60 and truncate
  let s = frac * 3600 - m * 60

  // Round the result to the given precision
  s = Math.round(s * factor) / factor

  // Ensure degrees is a positive value,
  // since we're returning direction as a string value
  d = Math.abs(d)

  return [d, m, s, dir]
}
