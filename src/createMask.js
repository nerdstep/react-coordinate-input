import { fill } from './utils'

const DIGIT = /\d/
const NS = /[nNsS]/
const EW = /[eEwW]/

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
 * Returns an input mask using the provided symbols
 *
 * @param {object} symbols        - character symbols to use in the mask
 * @param {string} symbols.degree - degrees symbol, e.g. °
 * @param {string} symbols.minute - minutes symbol e.g. ′
 * @param {string} symbols.second - seconds symbol e.g. ″
 * @param {string} symbols.spacer - space character
 * @param {number} dmsPrecision   - decimal places for seconds
 * @return {array}                - input mask
 */
export default function createMask(
  { degree, minute, second, spacer },
  dmsPrecision = 0
) {
  const lat = [].concat(
    createPart(degree, spacer, 2, 0),
    createPart(minute, spacer, 2, 0),
    createPart(second, spacer, 2, dmsPrecision),
    [NS, spacer]
  )

  const lon = [].concat(
    createPart(degree, spacer, 3, 0),
    createPart(minute, spacer, 2, 0),
    createPart(second, spacer, 2, dmsPrecision),
    [EW]
  )

  return [].concat(lat, lon)
}
