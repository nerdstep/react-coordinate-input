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
function isInvalid(conformedValue, { format, max, min }, offset = 0) {
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
    ((values.dd && values.dd === 90) || (values.ddd && values.ddd === 180)) &&
    (values.mm > 0 || values.ss > 0)
  ) {
    invalid = true
  }

  return invalid
}

/**
 * createLatLongPipe
 *
 * Returns a pipe function that validates lat/long values are in range.
 */
export default function createLatLongPipe() {
  return conformedValue => {
    const formats = {
      lat: {
        format: 'dd° mm′ ss″ D',
        max: { dd: 90, mm: 59, ss: 59 },
        min: { dd: 0, mm: 0, ss: 0 },
      },
      long: {
        format: 'ddd° mm′ ss″ D',
        max: { ddd: 180, mm: 59, ss: 59 },
        min: { ddd: 0, mm: 0, ss: 0 },
      },
    }

    // Offset is the length of the lat format plus 1 for a space character.
    // This is needed to get the correct indexes when checking the longitude.
    const offset = formats.lat.format.length + 1
    const conformedValueArr = conformedValue.split('')

    const latCharArr = getPipedChars(conformedValueArr, formats.lat)
    const longCharArr = getPipedChars(conformedValueArr, formats.long, offset)
    const indexesOfPipedChars = latCharArr.concat(longCharArr)

    const isLatInvalid = isInvalid(conformedValue, formats.lat)
    const isLongInvalid = isInvalid(conformedValue, formats.long, offset)

    //console.log(conformedValue, isLatInvalid, isLongInvalid)

    if (isLatInvalid || isLongInvalid) {
      return false
    }

    return {
      // ensure uppercase
      value: conformedValueArr.join('').toUpperCase(),
      indexesOfPipedChars,
    }
  }
}
