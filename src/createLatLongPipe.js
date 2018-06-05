import { fill } from './utils'

/**
 * getPipedChars
 *
 * Determines if the first character entered for a slot is larger
 * than the allowed number and replaces it with a 0 if so.
 * For example, the max value for minutes/seconds is 59,
 * so if the user start the slot by entering a 7, this will correct
 * the value to be 07 instead.
 *
 * Note: The conformedValues array is being mutated here.
 *
 * @param {array} conformedValues
 * @param {object} format
 * @param {number} offset
 * @returns {array} array of indexes added by the pipe
 */
function getPipedChars(conformedValues, { format, max }, offset = 0) {
  const keyArray = Object.keys(max)
  const result = []

  keyArray.forEach(key => {
    const position = format.indexOf(key) + offset
    const maxFirstDigit = parseInt(max[key].toString().substr(0, 1), 10)
    const value = parseInt(conformedValues[position], 10)

    if (value > maxFirstDigit) {
      conformedValues[position + 1] = conformedValues[position]
      conformedValues[position] = 0
      result.push(position)
    }
  })

  return result
}

/**
 * isInvalid
 *
 * Returns true if any of the values are out of range.
 *
 * @param {string} conformedValue
 * @param {object} format
 * @param {number} offset
 * @returns {boolean}
 */
function isInvalid(conformedValue, { decKey, format, max, min }, offset = 0) {
  const values = {}

  // Check min/max values
  let invalid = Object.keys(max).some(key => {
    const position = format.indexOf(key) + offset
    const length = key.length
    const textValue = conformedValue.substr(position, length)
    const value = parseInt(textValue, 10)

    values[key] = value

    return value > max[key] || (textValue.length === length && value < min[key])
  })

  // If lat degree is 90 or long is 180 then minutes & seconds must be 0
  if (
    (((values.dd && values.dd === 90) || (values.ddd && values.ddd === 180)) &&
      (values.mm > 0 || values.ss > 0)) ||
    (decKey && values[decKey] > 0)
  ) {
    invalid = true
  }

  return invalid
}

/**
 * createLatLongPipe
 *
 * Returns a pipe function that validates lat/long values are in range.
 *
 * @param {number} precision
 * @return {function}
 */
export default function createLatLongPipe(precision = 0) {
  return conformedValue => {
    const lat = {
      format: 'dd° mm′ ss″ D',
      max: { dd: 90, mm: 59, ss: 59 },
      min: { dd: 0, mm: 0, ss: 0 },
    }
    const lon = {
      format: 'ddd° mm′ ss″ D',
      max: { ddd: 180, mm: 59, ss: 59 },
      min: { ddd: 0, mm: 0, ss: 0 },
    }

    // Add decimal places for seconds
    if (precision > 0) {
      const decKey = fill([], 's', precision).join('')
      const decMax = parseInt(fill([], 9, precision).join(''), 10)

      lat.decKey = decKey
      lon.decKey = decKey
      lat.format = lat.format.replace(/ss/g, `ss.${decKey}`)
      lon.format = lon.format.replace(/ss/g, `ss.${decKey}`)
      lat.max[decKey] = decMax
      lon.max[decKey] = decMax
      lat.min[decKey] = 0
      lon.min[decKey] = 0
    }

    // Offset is the length of the lat format, plus 1 for a space character.
    // This is needed to get the correct indexes when checking the longitude.
    const offset = lat.format.length + 1
    const conformedValueArr = conformedValue.split('')

    const latCharArr = getPipedChars(conformedValueArr, lat)
    const lonCharArr = getPipedChars(conformedValueArr, lon, offset)
    const indexesOfPipedChars = latCharArr.concat(lonCharArr)

    const isLatInvalid = isInvalid(conformedValue, lat)
    const isLonInvalid = isInvalid(conformedValue, lon, offset)

    if (isLatInvalid || isLonInvalid) {
      return false
    }

    return {
      // ensure uppercase
      value: conformedValueArr.join('').toUpperCase(),
      indexesOfPipedChars,
    }
  }
}
