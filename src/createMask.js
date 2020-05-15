// @ts-check
import MaskedEnum from 'imask/esm/masked/enum'
import MaskedPattern from 'imask/esm/masked/pattern'
import MaskedRange from 'imask/esm/masked/range'
import 'imask/esm/masked/regexp'
import {
  DEGREE_CHAR,
  DOT,
  MINUTE_CHAR,
  PLACEHOLDER_CHAR,
  SECOND_CHAR,
  SPACER_CHAR,
} from './constants'
import { fill } from './utils'

/**
 * If latitude degrees is 90 or longitude degrees is 180
 * then ensure minutes & seconds are not greater than 0.
 *
 * @param {boolean} isLon
 * @param {number} precision
 * @returns {function}
 */
const minSecValidate = (isLon, precision) => (
  value,
  { parent: { _blocks } }
) => {
  const max = isLon ? 180 : 90
  // If precision is provided it will change the array position for lon degrees
  const pos = precision ? 13 : 11
  const parent = isLon ? _blocks[pos] : _blocks[0]
  const degrees = Number(parent.value)
  const seconds = Number(value)

  //console.log('validate', degrees, seconds, parent, _blocks)

  return !(degrees === max && seconds > 0)
}

const getDegreeMask = (isLon) => ({
  mask: MaskedRange,
  from: 0,
  to: isLon ? 180 : 90,
})

const getMinuteMask = (isLon, precision) => ({
  mask: MaskedRange,
  from: 0,
  to: 59,
  validate: minSecValidate(isLon, precision),
})

const getSecondMask = (isLon, precision) => ({
  mask: MaskedRange,
  from: 0,
  to: 59,
  validate: minSecValidate(isLon, precision),
})

const getArcSecondMask = (precision) => ({
  mask: MaskedRange,
  from: 0,
  to: Number(fill([], 9, precision).join('')),
})

const getDirectionMask = (isLon) => ({
  mask: MaskedEnum,
  enum: isLon ? ['E', 'W'] : ['N', 'S'],
  prepare: (str) => str.toUpperCase(),
})

/**
 * createMask
 *
 * Returns an input mask using the provided symbols
 *
 * @param {Object} [options] Mask options
 * @property {string} [degreeChar] Degrees symbol, e.g. `°`
 * @property {string} [minuteChar] Minutes symbol, e.g. `′`
 * @property {string} [secondChar] Seconds symbol, e.g. `″`
 * @property {string} [spacerChar] Spacer character, e.g. ` `
 * @property {string} [placeholderChar] Placeholder character, e.g. `_`
 * @property {number} [dmsPrecision] Second decimal places [0-6]
 */
export const createMask = ({
  degreeChar = DEGREE_CHAR,
  minuteChar = MINUTE_CHAR,
  secondChar = SECOND_CHAR,
  spacerChar = SPACER_CHAR,
  placeholderChar = PLACEHOLDER_CHAR,
  dmsPrecision = 0,
} = {}) => {
  const precision = dmsPrecision < 0 ? 0 : dmsPrecision > 6 ? 6 : dmsPrecision

  const mask = [
    'YD',
    'DC',
    'SPACER',
    'YM',
    'MC',
    'SPACER',
    'YS',
    'SC',
    'SPACER',
    'NS',
    'SPACER',
    'XD',
    'DC',
    'SPACER',
    'XM',
    'MC',
    'SPACER',
    'XS',
    'SC',
    'SPACER',
    'EW',
  ]

  if (precision > 0) {
    mask.splice(7, 0, 'DOT')
    mask.splice(8, 0, 'AS')
    mask.splice(20, 0, 'DOT')
    mask.splice(21, 0, 'AS')
  }

  // @ts-ignore
  return new MaskedPattern({
    mask: mask.join(''),
    placeholderChar,
    autofix: true,
    overwrite: true,
    // If placeholderChar is defined then set lazy to false,
    // which will display the placeholder character.
    lazy: placeholderChar === null,
    blocks: {
      DC: { mask: degreeChar },
      MC: { mask: minuteChar },
      SC: { mask: secondChar },
      SPACER: { mask: spacerChar },
      DOT: { mask: DOT },
      AS: getArcSecondMask(precision),
      YD: getDegreeMask(),
      YM: getMinuteMask(),
      YS: getSecondMask(),
      NS: getDirectionMask(),
      XD: getDegreeMask(true),
      XM: getMinuteMask(true, precision),
      XS: getSecondMask(true, precision),
      EW: getDirectionMask(true),
    },
  })
}
