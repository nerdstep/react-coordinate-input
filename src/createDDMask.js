// @ts-check
import MaskedPattern from 'imask/esm/masked/pattern'
import MaskedRange from 'imask/esm/masked/range'
import 'imask/esm/masked/regexp'
import { COMMA, DOT, PLACEHOLDER_CHAR, SPACER_CHAR } from './constants'
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

const getArcSecondMask = (precision, isLon) => ({
  mask: MaskedRange,
  from: 0,
  to: Number(fill([], 9, precision).join('')),
  validate: minSecValidate(isLon, precision),
})

/**
 * createDDMask
 *
 * Returns an input mask using the provided symbols
 *
 * @param {Object} [options] Mask options
 * @property {string} [commaChar] Comma character, e.g. `,`
 * @property {string} [spacerChar] Spacer character, e.g. ` `
 * @property {string} [placeholderChar] Placeholder character, e.g. `_`
 * @property {number} [ddPrecision] Degree decimal places [0-8]
 */
export const createDDMask = ({
  spacerChar = SPACER_CHAR,
  placeholderChar = PLACEHOLDER_CHAR,
  ddPrecision = 0,
} = {}) => {
  const precision = ddPrecision < 0 ? 0 : ddPrecision > 8 ? 8 : ddPrecision

  const mask = ['YD', 'DOT', 'AS', 'COMMA', 'SPACER', 'XD', 'DOT', 'AS']

  /*if (precision > 0) {
    mask.splice(7, 0, 'DOT')
    mask.splice(8, 0, 'AS')
    mask.splice(20, 0, 'DOT')
    mask.splice(21, 0, 'AS')
  }*/

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
      COMMA: { mask: COMMA },
      SPACER: { mask: spacerChar },
      DOT: { mask: DOT },
      AS: getArcSecondMask(precision),
      YD: getDegreeMask(),
      XD: getDegreeMask(true),
    },
  })
}
