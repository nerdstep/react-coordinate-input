// @ts-check
import { fill } from './utils'

const DIGIT = /\d/
const NS = /[nNsS]/
const EW = /[eEwW]/

/**
 * createPart
 *
 * @param {string} symbol Symbol character
 * @param {string} spacer Spacer character
 * @param {number} digits Number of digits
 * @param {number} precision Decimal places
 * @returns {any[]}
 */
const createPart = (symbol, spacer, digits, precision) => {
  const res = []

  fill(res, DIGIT, digits)

  if (precision > 0) {
    res.push('.')
    fill(res, DIGIT, precision)
  }

  res.push(symbol)
  res.push(spacer)

  return res
}

/**
 * createMask
 *
 * Returns an input mask using the provided symbols
 *
 * @param {Object} options Mask options
 * @property {string} degree Degrees symbol, e.g. °
 * @property {string} minute Minutes symbol e.g. ′
 * @property {string} second Seconds symbol e.g. ″
 * @property {string} spacer Spacer character
 * @property {number} precision Decimal places
 * @returns {any[]} Input mask
 */
export default function createMask({
  degree = '°',
  minute = '′',
  second = '″',
  spacer = ' ',
  precision = 0,
} = {}) {
  const lat = [].concat(
    createPart(degree, spacer, 2, 0),
    createPart(minute, spacer, 2, 0),
    createPart(second, spacer, 2, precision),
    [NS, spacer]
  )

  const lon = [].concat(
    createPart(degree, spacer, 3, 0),
    createPart(minute, spacer, 2, 0),
    createPart(second, spacer, 2, precision),
    [EW]
  )

  return [].concat(lat, lon)
}
